import React, { useState, Suspense, lazy } from 'react';
import mapboxgl from 'mapbox-gl';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from '@tanstack/react-query';
import { useMapData } from './map/useMapData';

// Lazy load map components
const MapContainer = lazy(() => import('./map/MapContainer'));
const MapFilters = lazy(() => import('./map/MapFilters'));
const MapMarkers = lazy(() => import('./map/MapMarkers'));
const MapHeatLayer = lazy(() => import('./map/MapHeatLayer'));
const MapControls = lazy(() => import('./map/MapControls'));

const Map = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const { impactCards, loadImpactCards } = useMapData();

  // Cache map data
  const { data: cachedImpactCards } = useQuery({
    queryKey: ['impact-cards'],
    queryFn: () => impactCards,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <div className="relative w-full h-[600px]">
      <Suspense fallback={<LoadingSpinner />}>
        <MapFilters onFiltersChange={loadImpactCards} />
        <MapContainer onMapLoad={setMap} />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
        <MapMarkers map={map} impactCards={cachedImpactCards || []} />
        <MapHeatLayer 
          map={map} 
          impactCards={cachedImpactCards || []} 
          visible={showHeatmap} 
        />
        <MapControls 
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        />
      </Suspense>
    </div>
  );
};

export default Map;