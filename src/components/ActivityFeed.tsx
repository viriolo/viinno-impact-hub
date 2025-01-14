import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, History, MessageCircle, ThumbsUp, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ActivityItem = {
  id: string;
  activity_type: string;
  metadata: Record<string, any>;
  created_at: string;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "impact_card_created":
      return <Activity className="w-4 h-4" />;
    case "profile_updated":
      return <User className="w-4 h-4" />;
    case "comment_added":
      return <MessageCircle className="w-4 h-4" />;
    case "like_added":
      return <ThumbsUp className="w-4 h-4" />;
    default:
      return <History className="w-4 h-4" />;
  }
};

const formatActivityMessage = (activity: ActivityItem) => {
  switch (activity.activity_type) {
    case "impact_card_created":
      return `Created a new impact card: ${activity.metadata.title}`;
    case "profile_updated":
      return "Updated their profile";
    case "comment_added":
      return `Commented on ${activity.metadata.target_title}`;
    case "like_added":
      return `Liked ${activity.metadata.target_title}`;
    default:
      return "Performed an action";
  }
};

export function ActivityFeed() {
  const { user } = useAuth();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["activities", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ActivityItem[];
    },
    enabled: !!user,
  });

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <p className="text-sm text-destructive">Failed to load activities</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
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
              {activities?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{formatActivityMessage(activity)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {activities?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}