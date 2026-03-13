import { LatLng, RideEstimate } from "@/types";
import { buildLyftDeepLink } from "./deeplinks";

interface LyftTokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: LyftTokenCache | null = null;

async function getLyftToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.LYFT_CLIENT_ID;
  const clientSecret = process.env.LYFT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Lyft credentials not configured");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await fetch("https://api.lyft.com/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      scope: "public",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Lyft token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  // Tokens are valid for 86400s (24h), cache with 5min buffer
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return tokenCache.token;
}

export async function getLyftEstimates(
  pickup: LatLng,
  dropoff: LatLng
): Promise<RideEstimate[]> {
  const token = await getLyftToken();

  const url = new URL("https://api.lyft.com/v1/cost");
  url.searchParams.set("start_lat", pickup.lat.toString());
  url.searchParams.set("start_lng", pickup.lng.toString());
  url.searchParams.set("end_lat", dropoff.lat.toString());
  url.searchParams.set("end_lng", dropoff.lng.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Lyft cost estimate failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const costEstimates: Array<{
    ride_type: string;
    display_name: string;
    estimated_cost_cents_min: number;
    estimated_cost_cents_max: number;
    currency: string;
    estimated_duration_seconds: number;
    is_valid_estimate: boolean;
    primetime_percentage?: string;
  }> = data.cost_estimates || [];

  return costEstimates
    .filter((e) => e.is_valid_estimate)
    .map((estimate) => {
      const surgeMultiplier = estimate.primetime_percentage
        ? 1 + parseInt(estimate.primetime_percentage, 10) / 100
        : 1;

      return {
        platform: "lyft" as const,
        productId: estimate.ride_type,
        displayName: estimate.display_name,
        description: getRideTypeDescription(estimate.ride_type),
        minPrice: estimate.estimated_cost_cents_min / 100,
        maxPrice: estimate.estimated_cost_cents_max / 100,
        currency: estimate.currency || "USD",
        etaSeconds: estimate.estimated_duration_seconds,
        surgeMultiplier,
        deepLink: buildLyftDeepLink(pickup, dropoff, estimate.ride_type),
        webFallbackLink: buildLyftWebLink(pickup, dropoff, estimate.ride_type),
        available: true,
      };
    });
}

function getRideTypeDescription(rideType: string): string {
  const descriptions: Record<string, string> = {
    lyft: "Everyday rides",
    lyft_xl: "For groups up to 6",
    lyft_lux: "Premium black cars",
    lyft_lux_black: "High-end black car",
    lyft_lux_black_xl: "Premium SUV",
    lyft_plus: "For groups up to 6",
    lyft_shared: "Share with others",
    lyft_shared_xl: "Shared larger ride",
  };
  return descriptions[rideType] || "Lyft ride";
}

function buildLyftWebLink(
  pickup: LatLng,
  dropoff: LatLng,
  rideType: string
): string {
  const params = new URLSearchParams({
    id: rideType,
    "pickup[latitude]": pickup.lat.toString(),
    "pickup[longitude]": pickup.lng.toString(),
    "destination[latitude]": dropoff.lat.toString(),
    "destination[longitude]": dropoff.lng.toString(),
  });
  return `https://www.lyft.com/ride?${params.toString()}`;
}
