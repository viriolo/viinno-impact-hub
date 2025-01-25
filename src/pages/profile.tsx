import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";
import { ProfileCompletionStatus } from "@/components/profile/ProfileCompletionStatus";
import { toast } from "sonner";
import { Loader2, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
    retry: 1,
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <ProfileHeader
              username={profile?.username}
              avatarUrl={profile?.avatar_url}
              location={profile?.location}
              impactPoints={1220}
              isEditable={true}
              isLoading={isUpdating}
            />
          </Card>

          <Tabs defaultValue="impact" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="impact">Impact Cards</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>
            <TabsContent value="impact">
              <ImpactCardsList userId={user?.id} />
            </TabsContent>
            <TabsContent value="badges">
              <UserBadges />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ProfileCompletionStatus />
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;