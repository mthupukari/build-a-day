"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import PriceCard, { PriceCardSkeleton, StaticPlatformCard } from "@/components/PriceCard";
import { LatLng, RideEstimate, PlatformResult } from "@/types";
import { buildWaymoLink, buildTeslaLink } from "@/lib/deeplinks";

interface AddressResult {
  address: string;
  latLng: LatLng;
}

type SortMode = "price" | "platform";

export default function Home() {
  const [results, setResults] = useState<RideEstimate[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("price");
  const [hasSearched, setHasSearched] = useState(false);
  const [lastPickup, setLastPickup] = useState("");
  const [lastDropoff, setLastDropoff] = useState("");

  async function handleSearch(pickup: AddressResult, dropoff: AddressResult) {
    setIsLoading(true);
    setResults([]);
    setErrors({});
    setHasSearched(true);
    setLastPickup(pickup.address);
    setLastDropoff(dropoff.address);

    const body = {
      pickupLat: pickup.latLng.lat,
      pickupLng: pickup.latLng.lng,
      dropoffLat: dropoff.latLng.lat,
      dropoffLng: dropoff.latLng.lng,
    };

    // Fetch from all platforms in parallel
    const [uberResult, lyftResult] = await Promise.allSettled([
      fetch("/api/estimates/uber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json() as Promise<PlatformResult>),
      fetch("/api/estimates/lyft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json() as Promise<PlatformResult>),
    ]);

    const allEstimates: RideEstimate[] = [];
    const newErrors: Record<string, string> = {};

    if (uberResult.status === "fulfilled") {
      if (uberResult.value.status === "success") {
        allEstimates.push(...uberResult.value.estimates);
      } else {
        newErrors.uber = uberResult.value.error || "Uber unavailable";
      }
    } else {
      newErrors.uber = "Failed to reach Uber API";
    }

    if (lyftResult.status === "fulfilled") {
      if (lyftResult.value.status === "success") {
        allEstimates.push(...lyftResult.value.estimates);
      } else {
        newErrors.lyft = lyftResult.value.error || "Lyft unavailable";
      }
    } else {
      newErrors.lyft = "Failed to reach Lyft API";
    }

    setResults(allEstimates);
    setErrors(newErrors);
    setIsLoading(false);
  }

  const sortedResults = [...results].sort((a, b) => {
    if (sortMode === "price") {
      return a.minPrice - b.minPrice;
    }
    return a.platform.localeCompare(b.platform);
  });

  const cheapestId =
    sortedResults.length > 0
      ? `${sortedResults[0].platform}-${sortedResults[0].productId}`
      : null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            RideCompare
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Compare Uber, Lyft & Waymo instantly
          </p>
        </div>

        {/* Search Form */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: "#12121f", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Trip summary */}
        {hasSearched && !isLoading && (lastPickup || lastDropoff) && (
          <div className="mb-4 text-xs text-gray-500 flex items-center gap-1.5 px-1">
            <span className="truncate max-w-[120px]">{lastPickup}</span>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="truncate max-w-[120px]">{lastDropoff}</span>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <PriceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && (
          <>
            {/* Sort + count bar */}
            {results.length > 0 && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  {results.length} ride option{results.length !== 1 ? "s" : ""} found
                </span>
                <div className="flex gap-1">
                  {(["price", "platform"] as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      className={`text-xs px-3 py-1 rounded-full transition-all ${
                        sortMode === mode
                          ? "bg-white/15 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {mode === "price" ? "Cheapest first" : "By platform"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ride options */}
            <div className="space-y-3">
              {sortedResults.map((estimate) => (
                <PriceCard
                  key={`${estimate.platform}-${estimate.productId}`}
                  estimate={estimate}
                  isCheapest={
                    `${estimate.platform}-${estimate.productId}` === cheapestId
                  }
                />
              ))}

              {/* Waymo — always shown, no API */}
              <StaticPlatformCard
                platform="waymo"
                status="no_api"
                link={buildWaymoLink()}
              />

              {/* Tesla Cybercab — coming soon */}
              <StaticPlatformCard
                platform="tesla"
                status="coming_soon"
                link={buildTeslaLink()}
              />
            </div>

            {/* API errors */}
            {Object.entries(errors).length > 0 && (
              <div className="mt-4 space-y-2">
                {Object.entries(errors).map(([platform, error]) => (
                  <div
                    key={platform}
                    className="rounded-xl px-3 py-2.5 text-xs text-orange-300 border border-orange-500/20"
                    style={{ backgroundColor: "rgba(251, 146, 60, 0.05)" }}
                  >
                    <span className="font-semibold capitalize">{platform}:</span>{" "}
                    {error}
                  </div>
                ))}
              </div>
            )}

            {/* No results at all */}
            {results.length === 0 && Object.keys(errors).length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  Could not fetch prices. Check your API keys in{" "}
                  <code className="text-orange-300">.env.local</code>.
                </p>
              </div>
            )}
          </>
        )}

        {/* First-launch empty state */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-gray-500 text-sm">
              Enter your pickup and destination to compare prices across all platforms
            </p>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Prices are estimates and may vary. Booking opens in the respective app.
        </p>
      </div>
    </main>
  );
}
