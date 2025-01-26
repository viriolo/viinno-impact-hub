import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { SearchInput } from "./activity/SearchInput";
import { ActivityList } from "./activity/ActivityList";
import { PaginationControls } from "./activity/PaginationControls";
import { ActivityError } from "./activity/ActivityError";
import { useActivities } from "@/hooks/useActivities";

const ITEMS_PER_PAGE = 5;

export function ActivityFeed() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: activitiesData,
    isLoading,
    error,
    refetch
  } = useActivities({
    userId: user?.id,
    searchTerm,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const totalPages = Math.ceil((activitiesData?.totalCount || 0) / ITEMS_PER_PAGE);

  if (error) {
    return <ActivityError error={error instanceof Error ? error : new Error("Failed to load activities")} onRetry={refetch} />;
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
          activities={activitiesData?.activities || []}
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