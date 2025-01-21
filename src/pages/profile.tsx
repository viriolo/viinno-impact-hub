import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SocialLinksForm } from "@/components/profile/SocialLinksForm";
import { AdditionalProfileForm } from "@/components/profile/AdditionalProfileForm";
import { profileSchema, type ProfileFormValues, type SocialLinks } from "@/types/profile";

const isSocialLinks = (value: unknown): value is SocialLinks => {
  if (typeof value !== 'object' || value === null) return false;
  const socialLinks = value as Record<string, unknown>;
  return (
    (typeof socialLinks.twitter === 'string' || socialLinks.twitter === undefined) &&
    (typeof socialLinks.linkedin === 'string' || socialLinks.linkedin === undefined) &&
    (typeof socialLinks.github === 'string' || socialLinks.github === undefined)
  );
};

const defaultSocialLinks: SocialLinks = {
  twitter: "",
  linkedin: "",
  github: "",
};

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
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
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      website: profile?.website || "",
      social_links: isSocialLinks(profile?.social_links) ? profile.social_links : defaultSocialLinks,
      academic_background: profile?.academic_background || "",
      professional_background: profile?.professional_background || "",
      expertise_areas: profile?.expertise_areas || [],
      organization_name: profile?.organization_name || "",
      organization_type: profile?.organization_type || "",
      organization_description: profile?.organization_description || "",
      skills: profile?.skills || [],
      interests: profile?.interests || [],
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        social_links: isSocialLinks(profile.social_links) ? profile.social_links : defaultSocialLinks,
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
    mutationFn: async (values: ProfileFormValues) => {
      if (!user?.id) throw new Error("No user ID");
      
      let avatarUrl = profile?.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ...values,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(values);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Customize your profile information and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ProfileAvatar
              avatarUrl={profile?.avatar_url}
              username={profile?.username}
              email={user?.email}
              onAvatarChange={(file) => setAvatarFile(file)}
            />

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <ProfileForm register={register} errors={errors} />
              </TabsContent>
              
              <TabsContent value="additional">
                <AdditionalProfileForm register={register} errors={errors} />
              </TabsContent>
              
              <TabsContent value="social">
                <SocialLinksForm register={register} errors={errors} />
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              className="w-full"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;