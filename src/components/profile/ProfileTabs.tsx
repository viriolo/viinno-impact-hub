import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { AdditionalProfileForm } from "./AdditionalProfileForm";
import { SocialLinksForm } from "./SocialLinksForm";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

interface ProfileTabsProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  role?: string;
  defaultTab?: string;
}

export const ProfileTabs = ({ register, errors, role = "scholar", defaultTab = "overview" }: ProfileTabsProps) => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  return (
    <Tabs defaultValue={section || defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="edit">Settings</TabsTrigger>
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
      
      <TabsContent value="edit">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
          <ProfileForm register={register} errors={errors} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};