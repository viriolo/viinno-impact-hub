
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Share, MoreHorizontal, Shield } from "lucide-react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { useToast } from "@/hooks/use-toast";
import { ProfileDataExport } from "@/components/profile/ProfileDataExport";
import { PortfolioGallery } from "@/components/profile/PortfolioGallery";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getUserSkillsWithEndorsements } from "@/services/endorsementService";
import { SkillsEndorsementsGrid } from "@/components/profile/sections/SkillsEndorsementsGrid";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { id: profileId } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // If profileId is provided, use it, otherwise use the current user's id
  const targetUserId = profileId || user?.id;
  
  // Check if this is the current user's profile
  const isCurrentUser = !profileId || profileId === user?.id;

  const handleMessage = () => {
    toast({
      title: "Opening messages",
      description: "Redirecting to messaging interface...",
    });
    // Add messaging logic here
  };

  const handleConnect = () => {
    toast({
      title: "Connection request",
      description: "Sending connection request...",
    });
    // Add connection logic here
  };

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", targetUserId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();

      if (error) throw error;
      return sanitizeProfileData(data);
    },
    enabled: !!targetUserId,
  });

  // Fetch user roles
  const { data: userRoles } = useQuery({
    queryKey: ["userRoles", targetUserId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", targetUserId);

      if (error) throw error;
      return data?.map(r => r.role) || [];
    },
    enabled: !!targetUserId,
  });

  // Fetch impact cards
  const { data: impactCards } = useQuery({
    queryKey: ["userImpactCards", targetUserId, refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
  });

  // Fetch skills with endorsements
  const { data: skillsWithEndorsements } = useQuery({
    queryKey: ["skillsWithEndorsements", targetUserId, user?.id, refreshTrigger],
    queryFn: async () => {
      return await getUserSkillsWithEndorsements(targetUserId!, user?.id);
    },
    enabled: !!targetUserId,
  });

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
  
  const coverPhotoUrl = profile?.cover_photo_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1920";

  // Function to refresh data
  const refreshProfileData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="w-full relative">
          <div className="w-full h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
            <img 
              src={coverPhotoUrl}
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              {isCurrentUser && (
                <Button size="sm" variant="secondary" className="flex items-center gap-1">
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              
              <Button size="sm" variant="secondary" className="flex items-center gap-1">
                <Share size={16} />
                <span className="hidden sm:inline">Share</span>
              </Button>
              
              <Button size="sm" variant="secondary" className="flex items-center gap-1">
                <MoreHorizontal size={16} />
                <span className="hidden sm:inline">More</span>
              </Button>
            </div>
            
            <div className="absolute -bottom-16 left-8 z-20">
              <Avatar className="h-[150px] w-[150px] border-4 border-white shadow-md relative">
                <AvatarImage src={profile?.avatar_url} alt={profile?.username || "User"} />
                <AvatarFallback className="text-4xl bg-primary/10">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
                {profile?.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <Shield className="h-6 w-6" />
                  </div>
                )}
              </Avatar>
            </div>
          </div>
          
          <div className="w-full bg-white pt-20 pb-6 px-8 shadow-sm">
            <div className="container mx-auto flex flex-wrap justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold mr-2">
                    {profile?.username || 'Scholar'}
                  </h1>
                  {profile?.is_verified && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {profile?.bio || 'Complete your profile to add a bio'}
                </p>
                <div className="flex items-center text-muted-foreground mt-2">
                  <span className="mr-4">{profile?.location || 'Location not set'}</span>
                  {userRoles?.[0] && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {userRoles[0]}
                    </span>
                  )}
                </div>
              </div>
              
              {isCurrentUser && (
                <div className="mt-4 sm:mt-0">
                  <ProfileDataExport userId={user?.id!} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-3">
              <ProfileInfoCard 
                username={profile?.username}
                role={userRoles?.[0]}
                isVerified={profile?.is_verified}
                stats={{
                  impactPoints: 1250,
                  connections: 48,
                  following: 124
                }}
                onMessage={handleMessage}
                onConnect={handleConnect}
                isCurrentUser={isCurrentUser}
              />
              
              <Card className="shadow-md mb-6 mt-6">
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
                isEditable={isCurrentUser}
                isVerified={profile?.is_verified}
              />
            </div>
            
            <div className="lg:col-span-6">
              <ProfileTabs 
                role={userRoles?.[0]} 
                profile={profile} 
              />
              
              {skillsWithEndorsements && skillsWithEndorsements.length > 0 && (
                <div className="mt-6">
                  <SkillsEndorsementsGrid 
                    skills={skillsWithEndorsements} 
                    userId={targetUserId!}
                    isCurrentUser={isCurrentUser}
                    onRefresh={refreshProfileData}
                  />
                </div>
              )}
              
              <div className="mt-6">
                <PortfolioGallery 
                  userId={targetUserId!} 
                  isCurrentUser={isCurrentUser}
                />
              </div>
            </div>
            
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
                      {isCurrentUser ? 
                        "You haven't created any impact cards yet." : 
                        "This user hasn't created any impact cards yet."}
                    </p>
                  )}
                </div>
              </Card>
            </div>
            
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}
