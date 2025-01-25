import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { ProfileFormValues, SocialLinks } from "@/types/profile";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";

export function ProfilePage() {
  const { user } = useAuth();
  const { register, formState: { errors } } = useForm<ProfileFormValues>();

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

  const primaryRole = userRoles?.[0] || "scholar";
  
  const socialLinks: SocialLinks = profile?.social_links ? {
    twitter: (profile.social_links as Record<string, string>).twitter,
    linkedin: (profile.social_links as Record<string, string>).linkedin,
    github: (profile.social_links as Record<string, string>).github
  } : {};

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <ProfileHeader
            username={profile?.username}
            avatarUrl={profile?.avatar_url}
            location={profile?.location}
            impactPoints={1200}
            isEditable={true}
            isVerified={true}
            role={primaryRole}
            socialLinks={socialLinks}
            bio={profile?.bio}
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ImpactCardsList userId={user?.id} />
          </div>
          <div>
            <UserBadges />
          </div>
        </div>

        <ProfileTabs
          register={register}
          errors={errors}
          role={primaryRole}
        />
      </div>
    </>
  );
}