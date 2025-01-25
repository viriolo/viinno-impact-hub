interface MapControlsProps {
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
}

const MapControls = ({ showHeatmap, onToggleHeatmap }: MapControlsProps) => {
  return (
    <button
      onClick={onToggleHeatmap}
      className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg z-10 hover:bg-gray-50"
    >
      {showHeatmap ? 'Hide Heat Map' : 'Show Heat Map'}
    </button>
  );
};

export default MapControls;