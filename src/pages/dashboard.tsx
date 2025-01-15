import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar,
  ChartBar,
  MessageSquare,
  Loader2 
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: impactCardsCount, isLoading: isLoadingCards } = useQuery({
    queryKey: ["impact-cards-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("impact_cards")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user?.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: followersCount, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("followers")
        .select("*", { count: 'exact', head: true })
        .eq("following_id", user?.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back{user?.email ? `, ${user.email}` : ''}</h1>
            <p className="text-muted-foreground mt-2">Here's an overview of your impact and activities</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Cards</CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingCards ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">{impactCardsCount}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingFollowers ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">{followersCount}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ActivityFeed />

            <Card>
              <CardHeader>
                <CardTitle>Impact Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px]">
                  <ChartBar className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}