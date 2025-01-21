import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { AdditionalProfileForm } from "./AdditionalProfileForm";
import { SocialLinksForm } from "./SocialLinksForm";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";

interface ProfileTabsProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export const ProfileTabs = ({ register, errors }: ProfileTabsProps) => {
  return (
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
  );
};