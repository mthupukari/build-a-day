import { NextRequest, NextResponse } from "next/server";
import { getLyftEstimates } from "@/lib/lyft";
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

  if (!process.env.LYFT_CLIENT_ID || !process.env.LYFT_CLIENT_SECRET) {
    const result: PlatformResult = {
      platform: "lyft",
      status: "error",
      estimates: [],
      error: "Lyft API keys not configured. Add LYFT_CLIENT_ID and LYFT_CLIENT_SECRET to .env.local",
    };
    return NextResponse.json(result);
  }

  try {
    const estimates = await getLyftEstimates(
      { lat: pickupLat, lng: pickupLng },
      { lat: dropoffLat, lng: dropoffLng }
    );

    const result: PlatformResult = {
      platform: "lyft",
      status: "success",
      estimates,
    };
    return NextResponse.json(result);
  } catch (error) {
    const result: PlatformResult = {
      platform: "lyft",
      status: "error",
      estimates: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(result);
  }
}
