import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { MapFilters } from './map/MapFilters';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const loadImpactCards = async (filters: {
    dateRange: DateRange | undefined;
    category: string | undefined;
    userId: string | undefined;
  }) => {
    try {
      let query = supabase
        .from('impact_cards')
        .select('*')
        .eq('status', 'published')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (filters.dateRange?.from) {
        query = query.gte('created_at', format(filters.dateRange.from, 'yyyy-MM-dd'));
      }
      if (filters.dateRange?.to) {
        query = query.lte('created_at', format(filters.dateRange.to, 'yyyy-MM-dd'));
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data: impactCards, error } = await query;

      if (error) {
        console.error('Error fetching impact cards:', error);
        return;
      }

      // Clear existing markers
      markers.forEach(marker => marker.remove());
      setMarkers([]);

      // Update heat map data
      if (map.current?.getSource('impact-cards')) {
        const geojsonData = {
          type: 'FeatureCollection',
          features: impactCards.map(card => ({
            type: 'Feature',
            properties: {
              intensity: 1, // You can adjust this based on card metrics
            },
            geometry: {
              type: 'Point',
              coordinates: [card.longitude, card.latitude],
            },
          })),
        };
        (map.current.getSource('impact-cards') as mapboxgl.GeoJSONSource).setData(
          geojsonData as any
        );
      }

      // Add new markers
      const newMarkers = impactCards.map(card => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3 class="font-semibold">${card.title}</h3>
           <p class="text-sm">${card.description || ''}</p>`
        );

        const marker = new mapboxgl.Marker()
          .setLngLat([card.longitude, card.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        return marker;
      });

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error in loadImpactCards:', error);
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Fetch Mapbox token from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          return;
        }

        const { token } = data;
        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          projection: 'globe',
          zoom: 1.5,
          center: [30, 15],
          pitch: 45,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Disable scroll zoom for smoother experience
        map.current.scrollZoom.disable();

        // Add atmosphere and fog effects
        map.current.on('style.load', () => {
          map.current?.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });

          // Add heat map source and layer
          map.current?.addSource('impact-cards', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          map.current?.addLayer({
            id: 'impact-cards-heat',
            type: 'heatmap',
            source: 'impact-cards',
            paint: {
              // Increase weight as magnitude increases
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'intensity'],
                0, 0,
                1, 1
              ],
              // Increase intensity as zoom level increases
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 3
              ],
              // Assign color values be applied to points depending on their density
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
              // Adjust the heatmap radius with zoom level
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                9, 20
              ],
              // Transition from heatmap to circle layer by zoom level
              'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,
                9, 0
              ],
            },
          });
          
          // Load initial markers
          loadImpactCards({
            dateRange: undefined,
            category: undefined,
            userId: undefined,
          });
        });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      markers.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[600px]">
      <MapFilters onFiltersChange={loadImpactCards} />
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      <button
        onClick={() => {
          setShowHeatmap(!showHeatmap);
          if (map.current) {
            const opacity = showHeatmap ? 0 : 1;
            map.current.setPaintProperty('impact-cards-heat', 'heatmap-opacity', opacity);
          }
        }}
        className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg z-10 hover:bg-gray-50"
      >
        {showHeatmap ? 'Hide Heat Map' : 'Show Heat Map'}
      </button>
    </div>
  );
};

export default Map;