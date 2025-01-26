import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ActivityItem = {
  id: string;
  activity_type: string;
  metadata: Record<string, any>;
  created_at: string;
};

interface UseActivitiesProps {
  userId?: string;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
}

export function useActivities({ userId, searchTerm, currentPage, itemsPerPage }: UseActivitiesProps) {
  return useQuery({
    queryKey: ["activities", userId, searchTerm, currentPage],
    queryFn: async () => {
      try {
        // First, get total count
        let countQuery = supabase
          .from("user_activities")
          .select("*", { count: 'exact', head: true });

        if (searchTerm) {
          countQuery = countQuery.or(`metadata->title.ilike.%${searchTerm}%,activity_type.ilike.%${searchTerm}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
          toast.error("Failed to load activities count");
          throw countError;
        }

        // Then get paginated data
        let query = supabase
          .from("user_activities")
          .select("*")
          .order("created_at", { ascending: false })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

        if (searchTerm) {
          query = query.or(`metadata->title.ilike.%${searchTerm}%,activity_type.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          toast.error("Failed to load activities");
          throw error;
        }

        return {
          activities: data as ActivityItem[],
          totalCount: count || 0
        };
      } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }
    },
    enabled: !!userId,
    placeholderData: { activities: [], totalCount: 0 },
  });
}