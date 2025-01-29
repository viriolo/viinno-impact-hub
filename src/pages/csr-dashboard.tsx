import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Globe2, 
  HandCoins, 
  LineChart,
  Search,
  FileText,
  Briefcase
} from "lucide-react";

interface CSRProfile {
  id: string;
  organization_name: string;
  csr_focus_areas: string[];
  impact_metrics: {
    total_funded: number;
    projects_supported: number;
    total_impact: number;
  };
}

export default function CSRDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: csrProfile } = useQuery({
    queryKey: ["csr-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, organization_name, csr_focus_areas, impact_metrics")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data as CSRProfile;
    },
    enabled: !!user?.id,
  });

  const { data: recentProjects } = useQuery({
    queryKey: ["recent-projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_cards")
        .select(`
          id,
          title,
          description,
          location,
          created_at,
          user_id,
          metrics
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {csrProfile?.organization_name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              You've supported {csrProfile?.impact_metrics?.projects_supported || 0} projects this year
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/discover")}
            >
              <Search className="h-6 w-6" />
              <span>Discover Projects</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/applications")}
            >
              <FileText className="h-6 w-6" />
              <span>Review Applications</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/reports")}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Generate Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/portfolio")}
            >
              <Briefcase className="h-6 w-6" />
              <span>Manage Portfolio</span>
            </Button>
          </div>

          {/* Impact Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funded</CardTitle>
                <HandCoins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${csrProfile?.impact_metrics?.total_funded?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects Supported</CardTitle>
                <Globe2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {csrProfile?.impact_metrics?.projects_supported || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Focus Areas</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {csrProfile?.csr_focus_areas?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {csrProfile?.impact_metrics?.total_impact || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects?.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.location}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/impact-cards/${project.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Impact Map */}
            <Card>
              <CardHeader>
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Map />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}