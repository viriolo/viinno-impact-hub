import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";

interface ProfileFormProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export const ProfileForm = ({ register, errors }: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          className="mt-1"
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register("bio")}
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location")}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          {...register("website")}
          className="mt-1"
          type="url"
        />
        {errors.website && (
          <p className="text-sm text-red-500 mt-1">
            {errors.website.message}
          </p>
        )}
      </div>
    </div>
  );
};