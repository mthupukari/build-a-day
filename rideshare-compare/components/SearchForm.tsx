"use client";

import { useEffect, useRef, useState } from "react";
import { LatLng } from "@/types";

interface AddressResult {
  address: string;
  latLng: LatLng;
}

interface SearchFormProps {
  onSearch: (
    pickup: AddressResult,
    dropoff: AddressResult
  ) => void;
  isLoading: boolean;
}

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [pickupValue, setPickupValue] = useState("");
  const [dropoffValue, setDropoffValue] = useState("");
  const [pickupLatLng, setPickupLatLng] = useState<LatLng | null>(null);
  const [dropoffLatLng, setDropoffLatLng] = useState<LatLng | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapsReady(false);
      return;
    }

    if (window.google?.maps) {
      setMapsReady(true);
      return;
    }

    window.initGoogleMaps = () => setMapsReady(true);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapsReady) return;

    const sfBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.3, -122.6),
      new google.maps.LatLng(37.9, -121.9)
    );

    if (pickupRef.current && !pickupAutocompleteRef.current) {
      pickupAutocompleteRef.current = new google.maps.places.Autocomplete(
        pickupRef.current,
        { bounds: sfBounds, fields: ["formatted_address", "geometry"] }
      );
      pickupAutocompleteRef.current.addListener("place_changed", () => {
        const place = pickupAutocompleteRef.current!.getPlace();
        if (place.geometry?.location) {
          setPickupValue(place.formatted_address || "");
          setPickupLatLng({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }

    if (dropoffRef.current && !dropoffAutocompleteRef.current) {
      dropoffAutocompleteRef.current = new google.maps.places.Autocomplete(
        dropoffRef.current,
        { bounds: sfBounds, fields: ["formatted_address", "geometry"] }
      );
      dropoffAutocompleteRef.current.addListener("place_changed", () => {
        const place = dropoffAutocompleteRef.current!.getPlace();
        if (place.geometry?.location) {
          setDropoffValue(place.formatted_address || "");
          setDropoffLatLng({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  }, [mapsReady]);

  async function geocodeAddress(address: string): Promise<LatLng> {
    const response = await fetch("/api/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (!response.ok) throw new Error("Could not find that address");
    const data = await response.json();
    return { lat: data.lat, lng: data.lng };
  }

  async function useMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPickupLatLng(latLng);

        // Reverse geocode for display
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (apiKey) {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&key=${apiKey}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.results?.[0]) {
              setPickupValue(data.results[0].formatted_address);
            } else {
              setPickupValue(`${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`);
            }
          } else {
            setPickupValue("My Location");
          }
        } catch {
          setPickupValue("My Location");
        }
        setGeoLoading(false);
      },
      () => {
        alert("Could not get your location. Please type your address.");
        setGeoLoading(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pickupValue.trim() || !dropoffValue.trim()) return;

    let finalPickupLatLng = pickupLatLng;
    let finalDropoffLatLng = dropoffLatLng;

    // Geocode if lat/lng wasn't set by autocomplete
    if (!finalPickupLatLng) {
      try {
        finalPickupLatLng = await geocodeAddress(pickupValue);
        setPickupLatLng(finalPickupLatLng);
      } catch {
        alert("Could not find pickup address. Try being more specific.");
        return;
      }
    }
    if (!finalDropoffLatLng) {
      try {
        finalDropoffLatLng = await geocodeAddress(dropoffValue);
        setDropoffLatLng(finalDropoffLatLng);
      } catch {
        alert("Could not find destination address. Try being more specific.");
        return;
      }
    }

    onSearch(
      { address: pickupValue, latLng: finalPickupLatLng },
      { address: dropoffValue, latLng: finalDropoffLatLng }
    );
  }

  const canSubmit =
    pickupValue.trim().length > 0 &&
    dropoffValue.trim().length > 0 &&
    !isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Pickup */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0" />
        <input
          ref={pickupRef}
          type="text"
          placeholder="Pickup location"
          value={pickupValue}
          onChange={(e) => {
            setPickupValue(e.target.value);
            setPickupLatLng(null);
          }}
          className="w-full bg-white/8 border border-white/15 rounded-xl pl-9 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 text-sm"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={useMyLocation}
          disabled={geoLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors p-1"
          title="Use my location"
        >
          {geoLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Vertical connector */}
      <div className="flex items-center gap-2 pl-4">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-0.5 h-1.5 bg-gray-600 rounded-full" />
          <div className="w-0.5 h-1.5 bg-gray-600 rounded-full" />
          <div className="w-0.5 h-1.5 bg-gray-600 rounded-full" />
        </div>
      </div>

      {/* Dropoff */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded bg-pink-400 flex-shrink-0" />
        <input
          ref={dropoffRef}
          type="text"
          placeholder="Where to?"
          value={dropoffValue}
          onChange={(e) => {
            setDropoffValue(e.target.value);
            setDropoffLatLng(null);
          }}
          className="w-full bg-white/8 border border-white/15 rounded-xl pl-9 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 focus:bg-white/10 text-sm"
          autoComplete="off"
        />
      </div>

      {/* Compare button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl font-bold text-base transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: canSubmit
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "#2a2a4a",
          color: "white",
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Fetching prices...
          </span>
        ) : (
          "Compare Prices"
        )}
      </button>
    </form>
  );
}
