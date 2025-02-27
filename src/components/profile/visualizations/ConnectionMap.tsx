
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Connection {
  id: string;
  name: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  avatar?: string;
}

interface ConnectionMapProps {
  connections: Connection[];
}

export function ConnectionMap({ connections }: ConnectionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // For security, we should use the Supabase Edge Function to get the token
        // In a real implementation, we'd use the following:
        // const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        // But for this demo, we'll use a temporary fallback for the map initialization:
        
        mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // This should be replaced with a proper token
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: [0, 20], // Center on world map
          zoom: 1.5,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Remove all existing markers first
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        // Wait for map to load before adding markers
        map.current.on("load", () => {
          setLoading(false);
          
          // Add markers for connections
          connections.forEach((connection) => {
            // Create custom popup content
            const popupHTML = `
              <div class="p-2">
                <div class="font-semibold">${connection.name}</div>
                <div class="text-sm text-muted-foreground">${connection.title}</div>
                <div class="text-sm">${connection.location}</div>
              </div>
            `;

            // Create popup
            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
            }).setHTML(popupHTML);

            // Create marker element
            const markerEl = document.createElement("div");
            markerEl.className = "marker-element";
            markerEl.style.backgroundColor = "#4f46e5";
            markerEl.style.width = "12px";
            markerEl.style.height = "12px";
            markerEl.style.borderRadius = "50%";
            markerEl.style.border = "2px solid white";
            markerEl.style.boxShadow = "0 0 0 2px rgba(79, 70, 229, 0.3)";

            // Add marker to map
            const marker = new mapboxgl.Marker(markerEl)
              .setLngLat([connection.longitude, connection.latitude])
              .setPopup(popup)
              .addTo(map.current!);

            markers.current.push(marker);
          });
        });
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to load the map. Please try again later.");
        setLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [connections]);

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Global Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        {connections.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No connections to display</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] bg-muted/50 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="h-[400px] rounded-lg relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <div
              ref={mapContainer}
              className="h-full w-full rounded-lg"
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
