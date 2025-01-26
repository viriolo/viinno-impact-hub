import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserRound, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  user_role?: Database["public"]["Tables"]["user_roles"]["Row"] | null;
};

export const CommunitySection = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["community-profiles"],
    queryFn: async () => {
      // First, get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select()
        .limit(6);
      
      if (profilesError) throw profilesError;

      // Then, for each profile, get their role
      const profilesWithRoles = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id)
            .maybeSingle(); // Using maybeSingle instead of single to handle no results case

          return {
            ...profile,
            user_role: roleData
          };
        })
      );

      return profilesWithRoles;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Our Community</h2>
          <Link 
            to="/community" 
            className="text-primary hover:underline inline-flex items-center"
          >
            <Users className="h-4 w-4 mr-2" />
            View All Members
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles?.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || ""} alt={profile.username || "User"} />
                    <AvatarFallback>
                      <UserRound className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${profile.id}`} className="hover:underline">
                      <h3 className="font-medium truncate">
                        {profile.username || "Anonymous User"}
                      </h3>
                    </Link>
                    {profile.user_role?.role && (
                      <Badge variant="secondary" className="mt-1">
                        {profile.user_role.role}
                      </Badge>
                    )}
                    {profile.location && (
                      <div className="flex items-center text-muted-foreground text-sm mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                {profile.bio && (
                  <p className="text-muted-foreground text-sm mt-4 line-clamp-2">
                    {profile.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};