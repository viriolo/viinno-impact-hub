import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { SearchInput } from "./activity/SearchInput";
import { ActivityList } from "./activity/ActivityList";
import { PaginationControls } from "./activity/PaginationControls";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

const ITEMS_PER_PAGE = 5;

type ActivityItem = {
  id: string;
  activity_type: string;
  metadata: Record<string, any>;
  created_at: string;
};

export function ActivityFeed() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: activities, isLoading, error, refetch } = useQuery({
    queryKey: ["activities", user?.id, searchTerm],
    queryFn: async () => {
      try {
        let query = supabase
          .from("user_activities")
          .select("*")
          .order("created_at", { ascending: false });

        if (searchTerm) {
          query = query.or(`metadata->title.ilike.%${searchTerm}%,activity_type.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          toast.error("Failed to load activities");
          throw error;
        }
        
        return data as ActivityItem[];
      } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }
    },
    enabled: !!user,
    placeholderData: [],
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
        <CardHeader className="flex flex-row items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Error Loading Activities</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Failed to load activities"}
          </p>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        
        <SearchInput 
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />

        <ActivityList 
          activities={paginatedActivities}
          isLoading={isLoading}
          searchTerm={searchTerm}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}