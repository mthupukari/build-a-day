import { NextRequest, NextResponse } from "next/server";
import { getUberEstimates } from "@/lib/uber";
import { PlatformResult } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = body;

  if (
    typeof pickupLat !== "number" ||
    typeof pickupLng !== "number" ||
    typeof dropoffLat !== "number" ||
    typeof dropoffLng !== "number"
  ) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  if (!process.env.UBER_CLIENT_ID || !process.env.UBER_CLIENT_SECRET) {
    const result: PlatformResult = {
      platform: "uber",
      status: "error",
      estimates: [],
      error: "Uber API keys not configured. Add UBER_CLIENT_ID and UBER_CLIENT_SECRET to .env.local",
    };
    return NextResponse.json(result);
  }

  try {
    const estimates = await getUberEstimates(
      { lat: pickupLat, lng: pickupLng },
      { lat: dropoffLat, lng: dropoffLng }
    );

    const result: PlatformResult = {
      platform: "uber",
      status: "success",
      estimates,
    };
    return NextResponse.json(result);
  } catch (error) {
    const result: PlatformResult = {
      platform: "uber",
      status: "error",
      estimates: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(result);
  }
}
