import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";
import { ProfileCompletionStatus } from "@/components/profile/ProfileCompletionStatus";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UserRound, Briefcase, GraduationCap, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'scholar':
        return <GraduationCap className="h-4 w-4" />;
      case 'mentor':
        return <Briefcase className="h-4 w-4" />;
      case 'csr_funder':
      case 'ngo':
        return <Building2 className="h-4 w-4" />;
      default:
        return <UserRound className="h-4 w-4" />;
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

            <Tabs defaultValue="impact" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="impact">Impact Cards</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              <TabsContent value="impact">
                <ImpactCardsList userId={user?.id} />
              </TabsContent>
              <TabsContent value="badges">
                <UserBadges />
              </TabsContent>
              <TabsContent value="activities">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                  {/* Activity feed will be implemented in the next iteration */}
                  <p className="text-muted-foreground">No recent activities</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <ProfileCompletionStatus />
            
            {/* Role Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Roles</h3>
              <div className="space-y-2">
                {userRoles?.map((role) => (
                  <div key={role} className="flex items-center gap-2 text-sm">
                    {getRoleIcon(role)}
                    <span className="capitalize">{role.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </Card>

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

            {/* Professional Information */}
            {profile?.professional_background && (
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Background</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.professional_background}
                  </p>
                </div>
              </Card>
            )}

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

export default ProfilePage;