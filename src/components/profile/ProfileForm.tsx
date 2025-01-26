import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";
import { Card } from "@/components/ui/card";

interface ProfileFormProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export const ProfileForm = ({ register, errors }: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              {...register("username", { required: "Username is required" })}
              className="mt-1"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              {...register("bio", { required: "Bio is required" })}
              className="mt-1"
              rows={4}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="text-sm text-red-500 mt-1">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              {...register("location", { required: "Location is required" })}
              className="mt-1"
              placeholder="City, Country"
            />
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Academic & Professional Background</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="academic_background">Academic Background *</Label>
            <Textarea
              id="academic_background"
              {...register("academic_background", { required: "Academic background is required" })}
              className="mt-1"
              rows={3}
              placeholder="Your educational history and qualifications..."
            />
            {errors.academic_background && (
              <p className="text-sm text-red-500 mt-1">
                {errors.academic_background.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="professional_background">Professional Background *</Label>
            <Textarea
              id="professional_background"
              {...register("professional_background", { required: "Professional background is required" })}
              className="mt-1"
              rows={3}
              placeholder="Your work experience and expertise..."
            />
            {errors.professional_background && (
              <p className="text-sm text-red-500 mt-1">
                {errors.professional_background.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated) *</Label>
            <Input
              id="skills"
              {...register("skills", { required: "At least one skill is required" })}
              className="mt-1"
              placeholder="e.g., Project Management, Research, Data Analysis"
            />
            {errors.skills && (
              <p className="text-sm text-red-500 mt-1">
                {errors.skills.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="interests">Interests (comma-separated) *</Label>
            <Input
              id="interests"
              {...register("interests", { required: "At least one interest is required" })}
              className="mt-1"
              placeholder="e.g., Sustainable Development, Education, Healthcare"
            />
            {errors.interests && (
              <p className="text-sm text-red-500 mt-1">
                {errors.interests.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register("website", {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL"
                }
              })}
              className="mt-1"
              type="url"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="text-sm text-red-500 mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="organization_name">Organization Name</Label>
            <Input
              id="organization_name"
              {...register("organization_name")}
              className="mt-1"
              placeholder="Your organization or institution"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};