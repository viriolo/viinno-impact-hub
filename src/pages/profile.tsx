import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";
import { UserBadges } from "@/components/badges/UserBadges";
import { ImpactCardsList } from "@/components/profile/ImpactCardsList";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function ProfilePage() {
  const { user } = useAuth();
  const { register, formState: { errors } } = useForm<ProfileFormValues>();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');

  const { data: profile, error, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center space-y-4">
          <UserRound className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-red-500">Failed to load profile. Please try again later.</p>
        </Card>
      </div>
    );
  }

  // Use a default date if created_at is not available
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="mb-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt={profile?.username || "User"}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold">{profile?.username || "User"}</h1>
                  <p className="text-gray-600">{profile?.bio || "No bio provided"}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>{profile?.location || "Location not set"}</span>
                    <span className="mx-2">•</span>
                    <span>Impact Points: 1200</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="hover:bg-gray-50">
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Impact Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImpactCardsList userId={user?.id} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Achievements & Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3].map((badge) => (
                <HoverCard key={badge}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full h-full aspect-square rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xl">🏆</span>
                        </div>
                      </div>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Achievement Title</h4>
                      <p className="text-sm text-muted-foreground">
                        Detailed description of the achievement and how it was earned.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-12 py-6 border-t">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <span>Member since {memberSince}</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}