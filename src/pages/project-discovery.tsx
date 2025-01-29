import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Filter, 
  Globe,
  Target,
  Loader2
} from "lucide-react";
import { useState } from "react";
import Map from "@/components/Map";

export default function ProjectDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fundingRange, setFundingRange] = useState([0, 100000]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", searchTerm, fundingRange, selectedRegion],
    queryFn: async () => {
      let query = supabase
        .from("impact_cards")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            organization_name
          )
        `)
        .eq('status', 'published');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedRegion) {
        query = query.eq('location', selectedRegion);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Project Discovery</h1>
            <p className="text-muted-foreground mt-2">
              Explore and filter through available projects seeking funding
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid gap-6 md:grid-cols-[300px,1fr]">
            {/* Filter Panel */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Funding Range</label>
                  <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
                    step={1000}
                    value={fundingRange}
                    onValueChange={setFundingRange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${fundingRange[0].toLocaleString()}</span>
                    <span>${fundingRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Asia", "Africa", "Europe", "Americas", "Oceania"].map((region) => (
                      <Button
                        key={region}
                        variant={selectedRegion === region ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                        className="h-8"
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">SDGs</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["No Poverty", "Zero Hunger", "Quality Education", "Clean Water"].map((sdg) => (
                      <Button
                        key={sdg}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        {sdg}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Grid */}
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{project.location || "Global"}</span>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Map View */}
          <Card>
            <CardHeader>
              <CardTitle>Project Locations</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Map />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}