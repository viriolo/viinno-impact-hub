import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ImpactCard } from '@/integrations/supabase/types/models.types';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  impactCards: ImpactCard[];
}

export const MapMarkers = ({ map, impactCards }: MapMarkersProps) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    if (!map) return;

    // Add new markers
    const newMarkers = impactCards.map(card => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3 class="font-semibold">${card.title}</h3>
         <p class="text-sm">${card.description || ''}</p>`
      );

      const marker = new mapboxgl.Marker()
        .setLngLat([card.longitude, card.latitude])
        .setPopup(popup)
        .addTo(map);

      return marker;
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [map, impactCards]);

  return null;
};
