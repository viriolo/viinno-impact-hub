
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";

// Intensity levels for the heatmap
type IntensityLevel = 0 | 1 | 2 | 3 | 4;

// Engagement entry for a specific date
interface EngagementEntry {
  date: Date;
  count: number;
  level: IntensityLevel;
  activities?: string[]; // Optional list of activities for the tooltip
}

interface EngagementHeatmapProps {
  engagementData: EngagementEntry[];
  maxMonthsToShow?: number;
}

export function EngagementHeatmap({
  engagementData,
  maxMonthsToShow = 3,
}: EngagementHeatmapProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate dates for current month view
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  // Generate months to display
  const months = Array.from({ length: maxMonthsToShow }, (_, i) => {
    return subMonths(currentDate, i);
  }).reverse();

  // Navigate to previous period
  const handlePrevious = () => {
    setCurrentDate(prevDate => subMonths(prevDate, maxMonthsToShow));
  };

  // Navigate to next period
  const handleNext = () => {
    const nextDate = addMonths(currentDate, maxMonthsToShow);
    const today = new Date();
    // Prevent navigating beyond current month
    if (nextDate <= today) {
      setCurrentDate(nextDate);
    }
  };

  // Get color based on engagement level
  const getLevelColor = (level: IntensityLevel) => {
    switch (level) {
      case 0: return "bg-gray-100";
      case 1: return "bg-green-100";
      case 2: return "bg-green-300";
      case 3: return "bg-green-500";
      case 4: return "bg-green-700";
      default: return "bg-gray-100";
    }
  };

  // Find engagement data for a specific date
  const getEngagementForDate = (date: Date) => {
    return engagementData.find(entry => 
      entry.date.getDate() === date.getDate() &&
      entry.date.getMonth() === date.getMonth() &&
      entry.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Engagement Activity
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0"
            disabled={isSameMonth(addMonths(currentDate, maxMonthsToShow), new Date())}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex items-center justify-end space-x-2 text-xs">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Less</span>
              <div className="w-3 h-3 rounded bg-gray-100"></div>
              <div className="w-3 h-3 rounded bg-green-100"></div>
              <div className="w-3 h-3 rounded bg-green-300"></div>
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <div className="w-3 h-3 rounded bg-green-700"></div>
              <span className="text-muted-foreground ml-2">More</span>
            </div>
          </div>

          {/* Months grid */}
          <div className="space-y-6">
            {months.map((month) => (
              <div key={month.toString()} className="space-y-2">
                <h3 className="text-sm font-medium">
                  {format(month, "MMMM yyyy")}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day labels */}
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="h-6 text-xs flex items-center justify-center text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for days before the 1st of the month */}
                  {Array.from({ length: getDaysInMonth(month)[0].getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 rounded-sm"></div>
                  ))}
                  
                  {/* Day cells */}
                  {getDaysInMonth(month).map((date) => {
                    const engagement = getEngagementForDate(date);
                    const level = engagement?.level || 0;
                    
                    return (
                      <div
                        key={date.toString()}
                        className={`
                          h-8 rounded-sm flex items-center justify-center relative
                          ${getLevelColor(level)}
                          ${isToday(date) ? "ring-2 ring-primary ring-offset-1" : ""}
                        `}
                        title={
                          engagement
                            ? `${format(date, "MMM d, yyyy")}: ${engagement.count} activities`
                            : format(date, "MMM d, yyyy")
                        }
                      >
                        <span className="text-xs">{date.getDate()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            <p>
              {engagementData.length} days of activity in the last 90 days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
