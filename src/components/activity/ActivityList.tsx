import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "./ActivityItem";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ActivityListProps {
  activities: Array<{
    id: string;
    activity_type: string;
    metadata: Record<string, any>;
    created_at: string;
  }>;
  isLoading: boolean;
  searchTerm: string;
  error?: Error;
}

export function ActivityList({ activities, isLoading, searchTerm, error }: ActivityListProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading activities",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <ScrollArea className="h-[400px] pr-4">
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4 p-3">
              <Skeleton className="h-10 w-10 rounded-full" />
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
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "No matching activities found" : "No recent activity"}
              </p>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
}