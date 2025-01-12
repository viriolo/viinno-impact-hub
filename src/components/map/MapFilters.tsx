import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, User, X } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface MapFiltersProps {
  onFiltersChange: (filters: {
    dateRange: DateRange | undefined;
    category: string | undefined;
    userId: string | undefined;
  }) => void;
}

const CATEGORIES = [
  "Environmental",
  "Social",
  "Educational",
  "Healthcare",
  "Community",
];

export function MapFilters({ onFiltersChange }: MapFiltersProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [category, setCategory] = useState<string>();
  const [userId, setUserId] = useState<string>();

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onFiltersChange({ dateRange: newDate, category, userId });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(category === newCategory ? undefined : newCategory);
    onFiltersChange({
      dateRange: date,
      category: category === newCategory ? undefined : newCategory,
      userId,
    });
  };

  const clearFilters = () => {
    setDate(undefined);
    setCategory(undefined);
    setUserId(undefined);
    onFiltersChange({ dateRange: undefined, category: undefined, userId: undefined });
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg space-y-4 w-72">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                "Date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat)}
                className="h-8"
              >
                <Filter className="mr-2 h-4 w-4" />
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}