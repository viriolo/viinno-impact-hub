import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Navigation } from "@/components/Navigation";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader />
        <ProfileTabs />
      </div>
    </div>
  );
}