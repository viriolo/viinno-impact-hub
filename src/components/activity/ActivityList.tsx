import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "./ActivityItem";

interface ActivityListProps {
  activities: Array<{
    id: string;
    activity_type: string;
    metadata: Record<string, any>;
    created_at: string;
  }>;
  isLoading: boolean;
  searchTerm: string;
}

export function ActivityList({ activities, isLoading, searchTerm }: ActivityListProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {searchTerm ? "No matching activities found" : "No recent activity"}
            </p>
          )}
        </div>
      )}
    </ScrollArea>
  );
}