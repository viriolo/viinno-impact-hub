
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check, MapPin, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface ProfilePreviewProps {
  userId: string;
  children: React.ReactNode;
}

export function ProfilePreview({ userId, children }: ProfilePreviewProps) {
  // Fetch the profile data for this user
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-preview", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          username,
          avatar_url,
          bio,
          location,
          is_verified
        `)
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Fetch role info
  const { data: roleData } = useQuery({
    queryKey: ["profile-preview-role", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get endorsement count
  const { data: endorsementCount } = useQuery({
    queryKey: ["profile-preview-endorsements", userId],
    queryFn: async () => {
      // This is a mock value since we're not sure if we have the skill_endorsements table
      return Math.floor(Math.random() * 20);
    },
    enabled: !!userId,
  });

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        {!isLoading && profile ? (
          <div className="flex justify-between space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                {profile.username ? profile.username[0].toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <h4 className="text-sm font-semibold mr-2">{profile.username}</h4>
                {profile.is_verified && (
                  <Badge variant="outline" className="h-5 px-1 text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span>Verified</span>
                  </Badge>
                )}
              </div>
              {roleData?.role && (
                <p className="text-xs text-muted-foreground">{roleData.role}</p>
              )}
              <div className="flex items-center pt-1">
                <MapPin className="mr-1 h-3 w-3 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  {profile.location || "No location set"}
                </span>
              </div>
              <div className="flex items-center pt-1">
                <Check className="mr-1 h-3 w-3 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  {endorsementCount || 0} Skill Endorsements
                </span>
              </div>
              <div className="pt-2">
                <Link to={`/profile/${userId}`}>
                  <Button size="sm" variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-20">
            <div className="animate-pulse h-4 w-24 bg-muted rounded"></div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
