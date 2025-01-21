import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";

interface AdditionalProfileFormProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export const AdditionalProfileForm = ({
  register,
  errors,
}: AdditionalProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="academic_background">Academic Background</Label>
        <Textarea
          id="academic_background"
          {...register("academic_background")}
          className="mt-1"
          rows={4}
          placeholder="Share your educational history and achievements"
        />
      </div>

      <div>
        <Label htmlFor="professional_background">Professional Background</Label>
        <Textarea
          id="professional_background"
          {...register("professional_background")}
          className="mt-1"
          rows={4}
          placeholder="Describe your work experience and professional achievements"
        />
      </div>

      <div>
        <Label htmlFor="organization_name">Organization Name</Label>
        <Input
          id="organization_name"
          {...register("organization_name")}
          className="mt-1"
          placeholder="Your current organization"
        />
      </div>

      <div>
        <Label htmlFor="organization_type">Organization Type</Label>
        <Input
          id="organization_type"
          {...register("organization_type")}
          className="mt-1"
          placeholder="e.g., NGO, Academic Institution, Corporation"
        />
      </div>

      <div>
        <Label htmlFor="organization_description">Organization Description</Label>
        <Textarea
          id="organization_description"
          {...register("organization_description")}
          className="mt-1"
          rows={4}
          placeholder="Brief description of your organization"
        />
      </div>
    </div>
  );
};