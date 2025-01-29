import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users,
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MentorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: mentorshipRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["mentorship-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentorship_requests")
        .select(`
          *,
          scholar:scholar_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("mentor_id", user?.id)
        .eq("status", "pending");

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: activeMentorships, isLoading: isLoadingMentorships } = useQuery({
    queryKey: ["active-mentorships", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentorship_requests")
        .select(`
          *,
          scholar:scholar_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("mentor_id", user?.id)
        .eq("status", "accepted");

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: upcomingSessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["upcoming-sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentorship_sessions")
        .select(`
          *,
          scholar:scholar_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("mentor_id", user?.id)
        .eq("status", "scheduled")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your mentorship activities and track your impact
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {mentorshipRequests?.length || 0}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Mentorships
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingMentorships ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {activeMentorships?.length || 0}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Sessions
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingSessions ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">
                    {upcomingSessions?.length || 0}
                  </div>
                )}
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : mentorshipRequests?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending requests
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mentorshipRequests?.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {request.scholar?.username}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Handle decline
                                }}
                              >
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  // Handle accept
                                }}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Active Mentorships</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMentorships ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : activeMentorships?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No active mentorships
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activeMentorships?.map((mentorship) => (
                      <Card key={mentorship.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {mentorship.scholar?.username}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Started{" "}
                                {new Date(
                                  mentorship.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Navigate to mentorship detail
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSessions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : upcomingSessions?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No upcoming sessions
                  </p>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions?.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {session.scholar?.username}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  session.scheduled_at
                                ).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Handle join session
                              }}
                            >
                              Join Session
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}