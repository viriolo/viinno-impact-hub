import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function UserBadges() {
  const { user } = useAuth();

  const { data: badges, isLoading, error } = useQuery({
    queryKey: ["user-badges", user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("user_badges")
          .select(`
            badge_id,
            awarded_at,
            badges (
              name,
              description,
              icon_url
            )
          `)
          .eq("user_id", user?.id);

        if (error) {
          toast.error("Failed to load badges");
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error fetching badges:", error);
        throw error;
      }
    },
    enabled: !!user,
    placeholderData: [],
  });

  if (!user) return null;

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-destructive">Failed to load badges</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : badges && badges.length > 0 ? (
            <div className="space-y-4">
              {badges.map((badge) => (
                <div key={badge.badge_id} className="flex items-start space-x-4">
                  {badge.badges.icon_url ? (
                    <img
                      src={badge.badges.icon_url}
                      alt={badge.badges.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <Award className="h-12 w-12 p-2 bg-primary/10 rounded-full" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{badge.badges.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(badge.awarded_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {badge.badges.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No badges earned yet</p>
              <p className="text-sm">Complete actions to earn badges!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}