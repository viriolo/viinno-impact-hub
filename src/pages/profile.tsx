import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";
import { ProfileCompletionStatus } from "@/components/profile/ProfileCompletionStatus";
import { ScholarProfile } from "@/components/profile/sections/ScholarProfile";
import { MentorProfile } from "@/components/profile/sections/MentorProfile";
import { CSRFunderProfile } from "@/components/profile/sections/CSRFunderProfile";
import { NGOProfile } from "@/components/profile/sections/NGOProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfilePage = () => {
  const { user } = useAuth();

  const { data: profile, error, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: userRoles } = useQuery({
    queryKey: ["userRoles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data.map(r => r.role);
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center space-y-4">
          <UserRound className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-red-500">Failed to load profile. Please try again later.</p>
        </Card>
      </div>
    );
  }

  const renderRoleSpecificProfile = () => {
    const primaryRole = userRoles?.[0];
    switch (primaryRole) {
      case 'scholar':
        return <ScholarProfile profile={profile} />;
      case 'mentor':
        return <MentorProfile profile={profile} />;
      case 'csr_funder':
        return <CSRFunderProfile profile={profile} />;
      case 'ngo':
        return <NGOProfile profile={profile} />;
      default:
        return (
          <Card className="p-6">
            <p className="text-muted-foreground">No role-specific information available</p>
          </Card>
        );
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <ProfileHeader
                username={profile?.username}
                avatarUrl={profile?.avatar_url}
                location={profile?.location}
                impactPoints={1220}
                isEditable={true}
              />
            </Card>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="impact">Impact Cards</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                {renderRoleSpecificProfile()}
              </TabsContent>
              
              <TabsContent value="impact">
                <ImpactCardsList userId={user?.id} />
              </TabsContent>
              
              <TabsContent value="badges">
                <UserBadges />
              </TabsContent>
              
              <TabsContent value="activities">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                  <p className="text-muted-foreground">No recent activities</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <ProfileCompletionStatus />
            
            {/* About Section */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {profile?.bio || "No bio added yet"}
                  </p>
                  {profile?.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {/* Skills and Expertise */}
            {profile?.skills && profile.skills.length > 0 && (
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};