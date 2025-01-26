import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ProfileCompletionStatus } from "@/components/profile/ProfileCompletionStatus";
import { UserBadges } from "@/components/badges/UserBadges";
import { CommunitySection } from "@/components/community/CommunitySection";
import { useAuth } from "@/components/AuthProvider";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <CommunitySection />
        {user && (
          <div className="container mx-auto px-4 py-8 grid gap-8 md:grid-cols-2">
            <ActivityFeed />
            <div className="space-y-8">
              <ProfileCompletionStatus />
              <UserBadges />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}