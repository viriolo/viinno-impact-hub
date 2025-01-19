import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, History, MessageCircle, ThumbsUp, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 5;

export function ActivityFeed() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["activities", user?.id, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("user_activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`metadata->title.ilike.%${searchTerm}%,activity_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ActivityItem[];
    },
    enabled: !!user,
  });

  const filteredActivities = activities || [];
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        
        <div className="mb-4">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full"
          />
        </div>

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
              {paginatedActivities.map((activity) => (
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
              {paginatedActivities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchTerm ? "No matching activities found" : "No recent activity"}
                </p>
              )}
            </div>
          )}
        </ScrollArea>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}