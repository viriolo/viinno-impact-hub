import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { SearchInput } from "./activity/SearchInput";
import { ActivityList } from "./activity/ActivityList";
import { PaginationControls } from "./activity/PaginationControls";

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