import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapContainer } from './map/MapContainer';
import { MapFilters } from './map/MapFilters';
import { MapMarkers } from './map/MapMarkers';
import { MapHeatLayer } from './map/MapHeatLayer';
import { MapControls } from './map/MapControls';
import { useMapData } from './map/useMapData';

const Map = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const { impactCards, loadImpactCards } = useMapData();

  return (
    <div className="relative w-full h-[600px]">
      <MapFilters onFiltersChange={loadImpactCards} />
      <MapContainer onMapLoad={setMap} />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      <MapMarkers map={map} impactCards={impactCards} />
      <MapHeatLayer 
        map={map} 
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