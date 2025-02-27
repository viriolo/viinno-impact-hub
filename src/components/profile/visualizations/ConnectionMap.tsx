
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2 } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

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

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem"
};

const defaultCenter = {
  lat: 20,
  lng: 0
};

export function ConnectionMap({ connections }: ConnectionMapProps) {
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBcufX9djtE5atVlr2qLvzjwXPphgh06Hc"
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

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
        ) : loadError ? (
          <div className="flex items-center justify-center h-[300px] bg-muted/50 rounded-lg">
            <p className="text-destructive">Error loading maps</p>
          </div>
        ) : !isLoaded ? (
          <div className="flex items-center justify-center h-[400px] bg-muted/50 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="h-[400px] rounded-lg relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={2}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                styles: [
                  {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
                  },
                  {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
                  }
                ]
              }}
            >
              {connections.map((connection) => (
                <Marker
                  key={connection.id}
                  position={{ lat: connection.latitude, lng: connection.longitude }}
                  onClick={() => setSelectedConnection(connection)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4f46e5",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2
                  }}
                />
              ))}
              
              {selectedConnection && (
                <InfoWindow
                  position={{ 
                    lat: selectedConnection.latitude, 
                    lng: selectedConnection.longitude 
                  }}
                  onCloseClick={() => setSelectedConnection(null)}
                >
                  <div className="p-2 max-w-[200px]">
                    <div className="font-semibold">{selectedConnection.name}</div>
                    <div className="text-sm text-gray-600">{selectedConnection.title}</div>
                    <div className="text-sm">{selectedConnection.location}</div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
