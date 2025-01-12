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
    </div>
  );
};

export default Map;