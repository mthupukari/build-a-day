# RideCompare Setup Guide

## Quick Start

### 1. Copy the env template
```bash
cp .env.example .env.local
```

### 2. Get API Keys

#### Google Maps (Required for address autocomplete)
1. Go to https://console.cloud.google.com
2. Create a project → Enable **Places API**, **Geocoding API**, **Maps JavaScript API**
3. Create an API key → Restrict it to `localhost` (Application restrictions → HTTP referrers)
4. Add the same key to both `GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

#### Lyft
1. Go to https://www.lyft.com/developers
2. Create an app → choose "Server-side" access
3. Copy Client ID and Client Secret

#### Uber
1. Go to https://developer.uber.com
2. Create an app
3. Copy Client ID and Client Secret
4. In sandbox mode, the API returns mock estimates — works for testing without approval

### 3. Run the app
```bash
npm run dev
```
Open http://localhost:3000

---

## Access from Your Phone (Same WiFi)

1. Find your computer's local IP:
   - Mac: `ipconfig getifaddr en0`
   - Linux: `ip addr show` or `hostname -I`

2. Run dev server on all interfaces:
```bash
npm run dev -- -H 0.0.0.0
```

3. On your phone, open: `http://YOUR_COMPUTER_IP:3000`

4. **Add to Home Screen** (PWA):
   - **iPhone**: Safari → Share button → "Add to Home Screen"
   - **Android**: Chrome → 3-dot menu → "Add to Home Screen"

   After adding, it launches fullscreen like a native app.

---

## .env.local Example
```
GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
UBER_CLIENT_ID=abc123...
UBER_CLIENT_SECRET=xyz789...
LYFT_CLIENT_ID=def456...
LYFT_CLIENT_SECRET=uvw321...
```

## Notes
- API keys stay on the server — the browser never sees them (except the Maps key for autocomplete, which should be domain-restricted)
- Waymo has no public API, so it shows an "Open App" link only
- Tesla Cybercab shows as "Coming Soon" (service not yet launched)
- Price estimates may differ slightly from actual fares
