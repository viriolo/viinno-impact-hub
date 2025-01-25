import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { AdditionalProfileForm } from "./AdditionalProfileForm";
import { SocialLinksForm } from "./SocialLinksForm";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";
import { Card } from "@/components/ui/card";

interface ProfileTabsProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  role?: string;
}

export const ProfileTabs = ({ register, errors, role = "scholar" }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <Card className="p-6">
          <div className="space-y-8">
            {role === "scholar" && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-4">Academic Background</h3>
                  <ProfileForm register={register} errors={errors} />
                </section>
                <section>
                  <h3 className="text-lg font-semibold mb-4">Skills & Endorsements</h3>
                  <AdditionalProfileForm register={register} errors={errors} />
                </section>
              </>
            )}
            {role === "mentor" && (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-4">Expertise & Availability</h3>
                  <AdditionalProfileForm register={register} errors={errors} />
                </section>
                <section>
                  <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                  <SocialLinksForm register={register} errors={errors} />
                </section>
              </>
            )}
            {/* Add similar sections for CSR Funder and NGO roles */}
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="projects">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Projects</h3>
          <p className="text-muted-foreground">No projects yet</p>
        </Card>
      </TabsContent>
      
      <TabsContent value="activity">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-muted-foreground">No recent activity</p>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
          <ProfileForm register={register} errors={errors} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};