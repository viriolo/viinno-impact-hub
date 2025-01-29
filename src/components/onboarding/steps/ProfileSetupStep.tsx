import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileSetupStepProps {
  onNext: (profileData: any) => void;
  onBack: () => void;
}

export function ProfileSetupStep({ onNext, onBack }: ProfileSetupStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "",
    location: "",
    professional_background: "",
    academic_background: "",
  });

  const handleAvatarChange = async (file: File) => {
    try {
      setIsLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = Object.values(profileData).every(value => value.trim());

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-muted-foreground">
          Add some details about yourself to help others get to know you better
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <ProfileAvatar
            onAvatarChange={handleAvatarChange}
            isLoading={isLoading}
            username={user?.user_metadata?.username}
            email={user?.email}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={profileData.location}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professional">Professional Background</Label>
            <Textarea
              id="professional"
              placeholder="Your work experience..."
              value={profileData.professional_background}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  professional_background: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic">Academic Background</Label>
            <Textarea
              id="academic"
              placeholder="Your educational history..."
              value={profileData.academic_background}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  academic_background: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <Button onClick={() => onNext(profileData)} disabled={!isValid || isLoading}>
          Continue
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}