import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { UserBadges } from "@/components/badges/UserBadges";
import { ProfileCompletionStatus } from "@/components/profile/ProfileCompletionStatus";
import { profileSchema, type ProfileFormValues, type SocialLinks } from "@/types/profile";
import { Loader2 } from "lucide-react";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const ProfilePage = () => {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      const socialLinks = profile.social_links as SocialLinks || {
        twitter: "",
        linkedin: "",
        github: "",
      };
      
      reset({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        social_links: socialLinks,
        academic_background: profile.academic_background || "",
        professional_background: profile.professional_background || "",
        expertise_areas: profile.expertise_areas || [],
        organization_name: profile.organization_name || "",
        organization_type: profile.organization_type || "",
        organization_description: profile.organization_description || "",
        skills: profile.skills || [],
        interests: profile.interests || [],
      });
    }
  }, [profile, reset]);

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!user?.id) throw new Error("No user ID found");

      // Handle avatar upload if a new file was selected
      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      // Update profile data
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    },
  });

  const onSubmit = handleSubmit((data) => {
    updateProfile.mutate(data);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <ProfileHeader />
              <form onSubmit={onSubmit} className="space-y-6">
                <ProfileAvatar
                  avatarUrl={profile?.avatar_url}
                  username={profile?.username}
                  email={user?.email}
                  onAvatarChange={setAvatarFile}
                />
                <ProfileTabs register={register} errors={errors} />
                <ProfileActions 
                  isSubmitting={updateProfile.isPending} 
                />
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ProfileCompletionStatus />
          <UserBadges />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;