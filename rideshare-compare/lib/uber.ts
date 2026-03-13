import { LatLng, RideEstimate } from "@/types";
import { buildUberDeepLink } from "./deeplinks";

interface UberTokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: UberTokenCache | null = null;

async function getUberToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.UBER_CLIENT_ID;
  const clientSecret = process.env.UBER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Uber credentials not configured");
  }

  const response = await fetch("https://login.uber.com/oauth/v2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "price_estimates",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Uber token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  // Cache with 5min buffer
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return tokenCache.token;
}

export async function getUberEstimates(
  pickup: LatLng,
  dropoff: LatLng
): Promise<RideEstimate[]> {
  const token = await getUberToken();

  const url = new URL("https://api.uber.com/v1.2/estimates/price");
  url.searchParams.set("start_latitude", pickup.lat.toString());
  url.searchParams.set("start_longitude", pickup.lng.toString());
  url.searchParams.set("end_latitude", dropoff.lat.toString());
  url.searchParams.set("end_longitude", dropoff.lng.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Uber price estimate failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const prices: Array<{
    product_id: string;
    display_name: string;
    description: string;
    low_estimate: number | null;
    high_estimate: number | null;
    currency_code: string;
    duration: number;
    surge_multiplier: number;
  }> = data.prices || [];

  return prices
    .filter((p) => p.low_estimate !== null && p.high_estimate !== null)
    .map((price) => ({
      platform: "uber" as const,
      productId: price.product_id,
      displayName: price.display_name,
      description: price.description || getUberProductDescription(price.display_name),
      minPrice: price.low_estimate!,
      maxPrice: price.high_estimate!,
      currency: price.currency_code || "USD",
      etaSeconds: price.duration,
      surgeMultiplier: price.surge_multiplier || 1,
      deepLink: buildUberDeepLink(pickup, dropoff, price.product_id),
      webFallbackLink: buildUberWebLink(pickup, dropoff),
      available: true,
    }));
}

function getUberProductDescription(displayName: string): string {
  const name = displayName.toLowerCase();
  if (name.includes("pool") || name.includes("share")) return "Share with others";
  if (name.includes("black")) return "Premium black car";
  if (name.includes("suv") || name.includes("xl")) return "For groups up to 6";
  if (name.includes("comfort")) return "Newer cars, extra legroom";
  if (name.includes("green") || name.includes("electric")) return "Eco-friendly ride";
  return "Everyday rides";
}

function buildUberWebLink(pickup: LatLng, dropoff: LatLng): string {
  const params = new URLSearchParams({
    action: "setPickup",
    "pickup[latitude]": pickup.lat.toString(),
    "pickup[longitude]": pickup.lng.toString(),
    "dropoff[latitude]": dropoff.lat.toString(),
    "dropoff[longitude]": dropoff.lng.toString(),
  });
  return `https://m.uber.com/ul/?${params.toString()}`;
}
