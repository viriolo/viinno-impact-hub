import { IconInput } from "@/components/ui/icon-input";
import { MapPin, Search } from "lucide-react";
import { ChangeEvent } from "react";

interface SearchFiltersProps {
  searchTerm: string;
  locationFilter: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function SearchFilters({
  searchTerm,
  locationFilter,
  onSearchChange,
  onLocationChange,
}: SearchFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IconInput
          icon={<Search className="h-4 w-4" />}
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full"
        />
        <IconInput
          icon={<MapPin className="h-4 w-4" />}
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={onLocationChange}
          className="w-full"
        />
      </div>
    </div>
  );
}