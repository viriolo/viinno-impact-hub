import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
        <Card className="p-8 text-center">
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
      <div className="space-y-8">
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

        <ImpactCardsList userId={user?.id} />
        
        <UserBadges />
      </div>
    </div>
  );
};

export default ProfilePage;