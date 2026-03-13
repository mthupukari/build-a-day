# Rideshare Price Comparison App — Implementation Plan

## What We're Building
A local Next.js web app (localhost:3000) that simultaneously fetches prices from
Uber and Lyft, shows a Waymo placeholder (no API exists), and provides a Tesla
Cybercab future placeholder. Results sorted cheapest-first with one-tap deep links
that open the native app with your destination pre-filled.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: Google Maps Places API (autocomplete) + Geocoding API
- **Platforms**: Uber API, Lyft API, Waymo (deep link only), Tesla Cybercab (placeholder)
- **Runtime**: Node.js, runs locally via `npm run dev`

## API Keys Required (user must obtain)
1. `UBER_CLIENT_ID` + `UBER_CLIENT_SECRET` — developer.uber.com
2. `LYFT_CLIENT_ID` + `LYFT_CLIENT_SECRET` — developer.lyft.com
3. `GOOGLE_MAPS_API_KEY` — console.cloud.google.com (Places + Geocoding APIs)

## File Structure
```
rideshare-compare/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Main comparison UI
│   ├── globals.css
│   └── api/
│       ├── estimates/
│       │   ├── uber/route.ts       # Server-side Uber price fetch
│       │   └── lyft/route.ts       # Server-side Lyft price fetch
│       └── geocode/route.ts        # Address → {lat, lng} via Google
├── components/
│   ├── SearchForm.tsx              # Pickup + destination with autocomplete
│   ├── PriceCard.tsx               # Single platform result card
│   ├── ResultsGrid.tsx             # All results sorted by price
│   └── PlatformBadge.tsx           # Status badges (Live, No API, Coming Soon)
├── lib/
│   ├── uber.ts                     # Uber OAuth + price estimates client
│   ├── lyft.ts                     # Lyft OAuth + cost estimates client
│   └── deeplinks.ts                # Deep link URL generators for each platform
├── types/
│   └── index.ts                    # Shared TypeScript types
├── .env.local                      # API keys — NEVER committed
├── .env.example                    # Template committed to repo
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Implementation Steps

### Step 1: Project scaffold
- Init Next.js 14 project with TypeScript + Tailwind
- Install dependencies: axios, @types/node
- Set up .env.local template
- Configure .gitignore to exclude all secrets

### Step 2: Types and shared interfaces
- RideEstimate type (platform, vehicleType, minPrice, maxPrice, currency, eta, surgeMultiplier, deepLink)
- SearchParams type (pickupLat, pickupLng, dropoffLat, dropoffLng)

### Step 3: Google Maps geocoding API route
- POST /api/geocode — accepts address string, returns {lat, lng}
- Server-side only (key never exposed to browser)
- Handles errors gracefully

### Step 4: Lyft API integration
- OAuth2 client credentials flow (2-legged, simpler)
- Token caching in memory (tokens valid 24h)
- GET cost estimates with pickup/dropoff coords
- Returns all ride types (Lyft, Lyft XL, Lyft Lux, etc.)
- POST /api/estimates/lyft route

### Step 5: Uber API integration
- OAuth2 client credentials flow
- GET /estimates/price with pickup/dropoff coords
- Returns all products (UberX, Uber Comfort, Uber Black, etc.)
- POST /api/estimates/uber route

### Step 6: Deep link generator
- Uber: uber://riderequest?pickup[lat]&dropoff[lat]&dropoff[lng] (falls back to m.uber.com)
- Lyft: lyft://ridetype?id=lyft&pickup[latitude]&destination[latitude] (falls back to lyft.com/ride)
- Waymo: https://waymo.com/waymo-one/ (no coordinate support)
- Tesla: placeholder (no service yet)

### Step 7: Search form component
- Two inputs: Pickup and Destination
- Google Maps Places Autocomplete on each input
- "Use my location" button for pickup (browser geolocation API)
- Compare button triggers parallel API fetches

### Step 8: Results display
- Loading skeletons while fetching
- PriceCard per ride type per platform
- Sort by price (cheapest first toggle)
- Each card shows: logo, ride type, price range, ETA, surge badge
- "Book" button → opens deep link
- Waymo card shows "Open App" with note "No price preview available"
- Tesla card shows "Coming Soon" placeholder

### Step 9: Error handling + UX polish
- Handle API failures gracefully (show "unavailable" vs crashing)
- Handle no-service-area (Waymo not in coverage)
- Rate limit protection (debounce requests)
- Mobile-responsive layout

## Security Design
- ALL API keys live exclusively in Next.js API routes (server-side)
- Browser never sees any credential
- .env.local is gitignored
- Input sanitization on address fields (prevent injection)
- No user data stored — every request is stateless
- HTTPS for all external API calls
- Rate limiting: debounce compare button (min 2s between requests)

## Known Limitations
1. **Waymo**: Zero price data possible — no public API exists. Show "Open App" only.
2. **Tesla Cybercab**: Does not exist as a service yet — placeholder card only.
3. **Uber ToS**: Uber prohibits comparison apps in ToS, but this is local personal use only.
   Risk is effectively zero for a private localhost app never exposed to internet.
4. **Price estimates ≠ final fare**: Real fares depend on real-time conditions.
   Both Uber and Lyft price estimate APIs acknowledge this.
5. **Waymo coverage**: Only SF, LA, Phoenix, Austin, Vegas — SF user is fine.
6. **API approval**: Uber/Lyft sandbox is instant; production keys may need approval.
   App will work in sandbox for testing (may return mock data).

## What Success Looks Like
- Open localhost:3000
- Type origin + destination (or tap "Use my location")
- See Uber products + Lyft products side by side, sorted by price, within ~2 seconds
- Tap "Book" on cheapest option → native app opens with destination already filled in
- Pay within the app — done
