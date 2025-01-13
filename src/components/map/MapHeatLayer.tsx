import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { ImpactCard } from '@/integrations/supabase/types';

interface MapHeatLayerProps {
  map: mapboxgl.Map | null;
  impactCards: ImpactCard[];
  visible: boolean;
}

export const MapHeatLayer = ({ map, impactCards, visible }: MapHeatLayerProps) => {
  useEffect(() => {
    if (!map?.getSource('impact-cards')) return;

    const geojsonData = {
      type: 'FeatureCollection',
      features: impactCards.map(card => ({
        type: 'Feature',
        properties: {
          intensity: 1,
        },
        geometry: {
          type: 'Point',
          coordinates: [card.longitude, card.latitude],
        },
      })),
    };

    (map.getSource('impact-cards') as mapboxgl.GeoJSONSource).setData(
      geojsonData as any
    );
  }, [map, impactCards]);

  useEffect(() => {
    if (!map) return;
    map.setPaintProperty('impact-cards-heat', 'heatmap-opacity', visible ? 1 : 0);
  }, [map, visible]);

  return null;
};