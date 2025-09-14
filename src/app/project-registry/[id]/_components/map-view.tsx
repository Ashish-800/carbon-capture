"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type MapViewProps = {
  center: {
    lat: number;
    lng: number;
  };
};

export function MapView({ center }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-full w-full" />;
  }
  
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-center text-sm p-4">
          Google Maps API key is not configured. Please add it to display the map.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={center}
        defaultZoom={9}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"carboncapture-map"}
      >
        <Marker position={center} />
      </Map>
    </APIProvider>
  );
}
