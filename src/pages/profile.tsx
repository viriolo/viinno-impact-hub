import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";

const ProfilePage = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="space-y-8">
          <Card>
            <div className="h-48 bg-muted" />
          </Card>
        </div>
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
          />
        </Card>

        <ImpactCardsList userId={user?.id} />
        
        <UserBadges />
      </div>
    </div>
  );
};

export default ProfilePage;