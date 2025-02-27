
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sanitizeProfileData } from "@/utils/helpers";
import { Card } from "@/components/ui/card";
import { ImpactCard } from "@/components/impact-cards/ImpactCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Profile() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return sanitizeProfileData(data);
    },
    enabled: !!user?.id,
  });

  const { data: userRoles } = useQuery({
    queryKey: ["userRoles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data?.map(r => r.role) || [];
    },
    enabled: !!user?.id,
  });

  const { data: impactCards } = useQuery({
    queryKey: ["userImpactCards", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'username', 'avatar_url', 'bio', 'location', 
      'professional_background', 'academic_background'
    ];
    
    let completedFields = 0;
    requiredFields.forEach(field => {
      if (profile[field]) completedFields++;
    });
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Header - Full Width */}
      <div className="w-full bg-gradient-to-r from-primary/90 to-primary/70 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome, {profile?.username || 'Scholar'}!
          </h1>
          <p className="text-xl opacity-90 max-w-xl">
            Track your impact, connect with others, and showcase your contributions to sustainable development.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Profile Info (3/12 on large screens) */}
          <div className="lg:col-span-3">
            <Card className="shadow-md mb-6">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
                <div className="w-32 h-32 mx-auto mb-4">
                  <CircularProgressbar
                    value={profileCompletionPercentage}
                    text={`${profileCompletionPercentage}%`}
                    styles={buildStyles({
                      pathColor: profileCompletionPercentage > 75 ? "#10b981" : "#4ade80",
                      textColor: "#374151",
                      trailColor: "#d1d5db",
                    })}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Complete your profile to connect better with peers and opportunities.
                </p>
              </div>
            </Card>
            
            <ProfileHeader 
              username={profile?.username}
              avatarUrl={profile?.avatar_url}
              location={profile?.location}
              bio={profile?.bio}
              role={userRoles?.[0]}
              socialLinks={profile?.social_links}
              isEditable={true}
            />
          </div>
          
          {/* Column 2: Dynamic Content - ProfileTabs (6/12 on large screens) */}
          <div className="lg:col-span-6">
            <ProfileTabs role={userRoles?.[0]} profile={profile} />
          </div>
          
          {/* Column 3: Data Visualization - Recent Impact Cards (3/12 on large screens) */}
          <div className="lg:col-span-3">
            <Card className="shadow-md mb-6">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Recent Impact</h2>
                {impactCards && impactCards.length > 0 ? (
                  <div className="space-y-4">
                    {impactCards.map((card) => (
                      <div key={card.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <ImpactCard card={card} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    You haven't created any impact cards yet.
                  </p>
                )}
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
