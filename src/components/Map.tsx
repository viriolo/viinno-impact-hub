import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { MapFilters } from './map/MapFilters';
import { MapMarkers } from './map/MapMarkers';
import { MapHeatLayer } from './map/MapHeatLayer';
import { MapControls } from './map/MapControls';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ImpactCard } from '@/integrations/supabase/types';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [impactCards, setImpactCards] = useState<ImpactCard[]>([]);

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

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching impact cards:', error);
        return;
      }

      setImpactCards(data);
    } catch (error) {
      console.error('Error in loadImpactCards:', error);
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
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
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[600px]">
      <MapFilters onFiltersChange={loadImpactCards} />
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      <MapMarkers map={map.current} impactCards={impactCards} />
      <MapHeatLayer 
        map={map.current} 
        impactCards={impactCards} 
        visible={showHeatmap} 
      />
      <MapControls 
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
      />
    </div>
  );
};

export default Map;