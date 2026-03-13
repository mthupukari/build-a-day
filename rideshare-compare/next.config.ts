import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_PUBLIC_ vars are automatically exposed to the browser.
  // Server-only keys (UBER_, LYFT_, GOOGLE_MAPS_API_KEY) stay server-side.
  // No additional config needed — just documenting this here for clarity.
};

export default nextConfig;
