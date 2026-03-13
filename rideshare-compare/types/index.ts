export type Platform = "uber" | "lyft" | "waymo" | "tesla";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface SearchParams {
  pickupAddress: string;
  dropoffAddress: string;
  pickupLatLng: LatLng;
  dropoffLatLng: LatLng;
}

export interface RideEstimate {
  platform: Platform;
  productId: string;
  displayName: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  etaSeconds: number | null;
  surgeMultiplier: number;
  deepLink: string;
  webFallbackLink: string;
  available: boolean;
  unavailableReason?: string;
}

export interface PlatformResult {
  platform: Platform;
  status: "success" | "error" | "no_api" | "coming_soon";
  estimates: RideEstimate[];
  error?: string;
}

export interface GeocodeResponse {
  lat: number;
  lng: number;
  formattedAddress: string;
}
