
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MessageSquare, UserPlus, Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "connection" | "message" | "post" | "award";
  title: string;
  description: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface NetworkActivityFeedProps {
  initialActivities: ActivityItem[];
  loadMore: () => Promise<ActivityItem[]>;
}

export function NetworkActivityFeed({ initialActivities, loadMore }: NetworkActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const newActivities = await loadMore();
      if (newActivities.length === 0) {
        setHasMore(false);
      } else {
        setActivities([...activities, ...newActivities]);
      }
    } catch (error) {
      console.error("Error loading more activities", error);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, if no loadMore function is provided
  const demoLoadMore = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [];
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "connection":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "post":
        return <Activity className="h-5 w-5 text-purple-500" />;
      case "award":
        return <Award className="h-5 w-5 text-yellow-500" />;
      default:
        return <Activity className="h-5 w-5 text-primary" />;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Network Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No recent activity to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Network Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityIcon(activity.type)}
                  <h4 className="font-medium">{activity.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleLoadMore()} 
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
