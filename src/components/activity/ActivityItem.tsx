import { Activity, History, MessageCircle, ThumbsUp, User } from "lucide-react";

interface ActivityItemProps {
  activity: {
    id: string;
    activity_type: string;
    metadata: Record<string, any>;
    created_at: string;
  };
}

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

const formatActivityMessage = (activity: ActivityItemProps["activity"]) => {
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

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
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
  );
}