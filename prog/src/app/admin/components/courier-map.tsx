
'use client';

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Courier } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';

interface CourierMapProps {
  couriers: Courier[];
  onCourierSelect: (courier: Courier) => void;
  selectedCourierId?: string | null;
}

// Use an empty string if the API key is not provided, for development purposes
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""; 
// Default to Los Angeles if no couriers
const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 };

export function CourierMap({ couriers, onCourierSelect, selectedCourierId }: CourierMapProps) {
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);

  useEffect(() => {
    if (couriers.length > 0) {
      // Calculate average position to center the map
      const avgLat = couriers.reduce((sum, c) => sum + c.currentLocation.lat, 0) / couriers.length;
      const avgLng = couriers.reduce((sum, c) => sum + c.currentLocation.lng, 0) / couriers.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    } else {
      setMapCenter(DEFAULT_CENTER);
    }
  }, [couriers]);

  const handleMarkerClick = (courier: Courier) => {
    onCourierSelect(courier);
    setActiveInfoWindow(courier.id);
    // Center map on selected courier
    setMapCenter(courier.currentLocation); 
  };

  // This condition might need adjustment if an empty string for API key is desired for dev mode.
  // If GOOGLE_MAPS_API_KEY can be "" for dev, this specific message block might not be shown.
  // The user's input implies that an empty string is fine and @vis.gl/react-google-maps will handle it.
  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE_PLACEHOLDER_NO_LONGER_USED") { // This condition is now unlikely to be met
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-lg p-4 text-center">
        <div className="space-y-2">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="font-semibold text-lg">Map Disabled</p>
          <p className="text-sm text-muted-foreground">
            Please provide a Google Maps API Key in your environment variables (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
            to enable the map fully. For development, it may work with limitations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={mapCenter}
        center={mapCenter}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="verydeli-map"
        className="w-full h-full rounded-md"
      >
        {couriers.map(courier => (
          <AdvancedMarker
            key={courier.id}
            position={courier.currentLocation}
            onClick={() => handleMarkerClick(courier)}
            title={courier.name}
          >
            <Pin
              background={selectedCourierId === courier.id ? 'var(--color-accent)' : 'var(--color-primary)'}
              borderColor={selectedCourierId === courier.id ? 'var(--color-accent)' : 'var(--color-primary)'}
              glyphColor={'#fff'}
            >
              <Truck className="h-5 w-5" />
            </Pin>
          </AdvancedMarker>
        ))}

        {selectedCourierId && couriers.find(c => c.id === selectedCourierId) && (
          <InfoWindow
            position={couriers.find(c => c.id === selectedCourierId)!.currentLocation}
            onCloseClick={() => setActiveInfoWindow(null)}
            pixelOffset={[0,-40]}
          >
            <div className="p-2 text-sm">
              <h4 className="font-bold text-base mb-1">{couriers.find(c => c.id === selectedCourierId)!.name}</h4>
              <p>Status: Active</p> {/* Replace with actual status if available */}
              <p>Vehicle: {couriers.find(c => c.id === selectedCourierId)!.vehicleType}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
