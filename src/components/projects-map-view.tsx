
"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";
import type { Project } from "@/lib/types";

type ProjectsMapViewProps = {
  projects: Pick<Project, 'id' | 'location'>[];
};

export function ProjectsMapView({ projects }: ProjectsMapViewProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-center text-sm p-4">
          Google Maps API key is not configured. Please add it to display the map.
        </p>
      </div>
    );
  }

  // Calculate the center of the map
  const center = projects.reduce(
    (acc, { location }) => {
      acc.lat += location.lat;
      acc.lng += location.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );
  center.lat /= projects.length;
  center.lng /= projects.length;

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={projects.length > 0 ? center : { lat: 0, lng: 0 }}
        defaultZoom={projects.length > 1 ? 1 : 5}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"carboncapture-map-dashboard"}
      >
        {projects.map((project) => (
          <Marker key={project.id} position={project.location} />
        ))}
      </Map>
    </APIProvider>
  );
}
