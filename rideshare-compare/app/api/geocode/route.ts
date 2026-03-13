import { NextRequest, NextResponse } from "next/server";
import { GeocodeResponse } from "@/types";

export async function POST(request: NextRequest) {
  const { address } = await request.json();

  if (!address || typeof address !== "string" || address.trim().length === 0) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address.trim());
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== "OK" || !data.results?.length) {
    return NextResponse.json(
      { error: `Geocoding failed: ${data.status}` },
      { status: 422 }
    );
  }

  const result = data.results[0];
  const location = result.geometry.location;

  const geocodeResponse: GeocodeResponse = {
    lat: location.lat,
    lng: location.lng,
    formattedAddress: result.formatted_address,
  };

  return NextResponse.json(geocodeResponse);
}
