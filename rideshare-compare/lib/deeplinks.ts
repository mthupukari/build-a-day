import { LatLng } from "@/types";

export function buildUberDeepLink(
  pickup: LatLng,
  dropoff: LatLng,
  productId?: string
): string {
  const params = new URLSearchParams({
    action: "setPickup",
    "pickup[latitude]": pickup.lat.toString(),
    "pickup[longitude]": pickup.lng.toString(),
    "dropoff[latitude]": dropoff.lat.toString(),
    "dropoff[longitude]": dropoff.lng.toString(),
  });
  if (productId) {
    params.set("product_id", productId);
  }
  return `uber://?${params.toString()}`;
}

export function buildLyftDeepLink(
  pickup: LatLng,
  dropoff: LatLng,
  rideType: string = "lyft"
): string {
  const params = new URLSearchParams({
    id: rideType,
    "pickup[latitude]": pickup.lat.toString(),
    "pickup[longitude]": pickup.lng.toString(),
    "destination[latitude]": dropoff.lat.toString(),
    "destination[longitude]": dropoff.lng.toString(),
  });
  return `lyft://ridetype?${params.toString()}`;
}

export function buildWaymoLink(): string {
  // Waymo has no deep link or API — send to their booking page
  return "https://waymo.com/waymo-one/";
}

export function buildTeslaLink(): string {
  return "https://www.tesla.com/en_us/campaign/robotaxi";
}
