import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export const ProfileCompletionStatus = () => {
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
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Calculate completion percentage based on filled fields
  const calculateCompletionPercentage = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'username',
      'bio',
      'location',
      'avatar_url',
      'academic_background',
      'professional_background',
      'organization_name',
      'skills',
      'social_links'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = profile[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value || {}).length > 0;
      return !!value;
    });

    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={completionPercentage} className="w-full" />
        <p className="text-sm text-muted-foreground text-center">
          {completionPercentage}% Complete
        </p>
      </CardContent>
    </Card>
  );
};