"use client";

import { RideEstimate, Platform } from "@/types";

interface PriceCardProps {
  estimate: RideEstimate;
  isCheapest?: boolean;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  uber: "#000000",
  lyft: "#FF00BF",
  waymo: "#00AEEF",
  tesla: "#CC0000",
};

const PLATFORM_LABELS: Record<Platform, string> = {
  uber: "Uber",
  lyft: "Lyft",
  waymo: "Waymo",
  tesla: "Tesla",
};

const PLATFORM_LOGOS: Record<Platform, string> = {
  uber: "U",
  lyft: "L",
  waymo: "W",
  tesla: "T",
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatEta(seconds: number | null): string {
  if (seconds === null) return "–";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

function handleBook(estimate: RideEstimate) {
  // Try native deep link first, fall back to web
  const deepLink = estimate.deepLink;
  const webLink = estimate.webFallbackLink;

  // On mobile, the deep link will open the app if installed
  // On desktop, it'll fail silently and we open the web link
  const a = document.createElement("a");
  a.href = deepLink;
  a.click();

  // Fallback to web after a short delay (if app didn't open)
  setTimeout(() => {
    window.open(webLink, "_blank", "noopener,noreferrer");
  }, 1500);
}

export default function PriceCard({ estimate, isCheapest }: PriceCardProps) {
  const color = PLATFORM_COLORS[estimate.platform];
  const hasSurge = estimate.surgeMultiplier > 1.05;

  return (
    <div
      className={`relative rounded-2xl p-4 border transition-all duration-200 active:scale-95 ${
        isCheapest
          ? "border-green-500/50 bg-green-950/20"
          : "border-white/10 bg-white/5"
      }`}
      style={{
        boxShadow: isCheapest
          ? "0 0 20px rgba(34, 197, 94, 0.1)"
          : undefined,
      }}
    >
      {isCheapest && (
        <div className="absolute -top-2.5 left-4 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
          BEST PRICE
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Platform + ride type */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {PLATFORM_LOGOS[estimate.platform]}
          </div>
          <div>
            <div className="font-semibold text-white text-sm leading-tight">
              {estimate.displayName}
            </div>
            <div className="text-xs text-gray-400 leading-tight">
              {estimate.description}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="font-bold text-white text-lg leading-tight">
            {formatPrice(estimate.minPrice, estimate.currency)}
            {estimate.maxPrice > estimate.minPrice && (
              <span className="text-gray-400 font-normal text-sm">
                {" – "}
                {formatPrice(estimate.maxPrice, estimate.currency)}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            {formatEta(estimate.etaSeconds)}
          </div>
        </div>
      </div>

      {/* Surge warning */}
      {hasSurge && (
        <div className="mt-2 flex items-center gap-1.5 bg-orange-950/40 border border-orange-500/30 rounded-lg px-2.5 py-1.5">
          <span className="text-orange-400 text-xs">
            Surge pricing active ({estimate.surgeMultiplier.toFixed(1)}x)
          </span>
        </div>
      )}

      {/* Book button */}
      <button
        onClick={() => handleBook(estimate)}
        className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
        style={{ backgroundColor: color, opacity: 0.9 }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.opacity = "1")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.opacity = "0.9")
        }
      >
        Book with {PLATFORM_LABELS[estimate.platform]}
      </button>
    </div>
  );
}

// Skeleton loading card
export function PriceCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-white/5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 bg-white/10 rounded" />
            <div className="h-3 w-28 bg-white/10 rounded" />
          </div>
        </div>
        <div className="text-right space-y-1.5">
          <div className="h-5 w-16 bg-white/10 rounded" />
          <div className="h-3 w-10 bg-white/10 rounded ml-auto" />
        </div>
      </div>
      <div className="mt-3 h-10 bg-white/10 rounded-xl" />
    </div>
  );
}

// No-API card (Waymo, Tesla)
interface StaticCardProps {
  platform: Platform;
  status: "no_api" | "coming_soon";
  link: string;
}

export function StaticPlatformCard({ platform, status, link }: StaticCardProps) {
  const color = PLATFORM_COLORS[platform];
  const label = PLATFORM_LABELS[platform];
  const logo = PLATFORM_LOGOS[platform];

  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-white/5 opacity-70">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {logo}
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{label}</div>
            <div className="text-xs text-gray-500">
              {status === "no_api"
                ? "No public pricing API"
                : "Not yet available"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-sm">–</div>
        </div>
      </div>

      {status === "no_api" && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-1.5 transition-all active:scale-95"
          style={{ backgroundColor: color, opacity: 0.7 }}
        >
          Open {label} App
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}

      {status === "coming_soon" && (
        <div className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm text-gray-500 flex items-center justify-center border border-white/10">
          Coming Soon
        </div>
      )}
    </div>
  );
}
