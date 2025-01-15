import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";

interface SocialLinksFormProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export const SocialLinksForm = ({ register, errors }: SocialLinksFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Social Links</h3>
      
      <div>
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          {...register("social_links.twitter")}
          className="mt-1"
          type="url"
        />
        {errors.social_links?.twitter && (
          <p className="text-sm text-red-500 mt-1">
            {errors.social_links.twitter.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          {...register("social_links.linkedin")}
          className="mt-1"
          type="url"
        />
        {errors.social_links?.linkedin && (
          <p className="text-sm text-red-500 mt-1">
            {errors.social_links.linkedin.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          {...register("social_links.github")}
          className="mt-1"
          type="url"
        />
        {errors.social_links?.github && (
          <p className="text-sm text-red-500 mt-1">
            {errors.social_links.github.message}
          </p>
        )}
      </div>
    </div>
  );
};