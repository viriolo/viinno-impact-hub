import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface MapContainerProps {
  onMapLoad: (map: mapboxgl.Map) => void;
}

const MapContainer = ({ onMapLoad }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError) {
          console.error('Error fetching Mapbox token:', tokenError);
          setError('Unable to load map: Failed to fetch Mapbox token');
          return;
        }

        const { token } = data;
        if (!token) {
          setError('Unable to load map: Mapbox token is not configured');
          return;
        }

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          projection: 'globe',
          zoom: 1.5,
          center: [30, 15],
          pitch: 45,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        map.current.scrollZoom.disable();

        map.current.on('style.load', () => {
          if (!map.current) return;
          
          map.current.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });

          map.current.addSource('impact-cards', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          map.current.addLayer({
            id: 'impact-cards-heat',
            type: 'heatmap',
            source: 'impact-cards',
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'intensity'],
                0, 0,
                1, 1
              ],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 3
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                9, 20
              ],
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,
                9, 0
              ],
            },
          });

          onMapLoad(map.current);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Unable to load map: An unexpected error occurred');
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [onMapLoad]);

  if (error) {
    return (
      <div className="absolute inset-0 rounded-lg shadow-lg bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
  );
};

export default MapContainer;