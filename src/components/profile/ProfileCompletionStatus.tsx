import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileCompletionStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const calculateTotalCompletion = () => {
    if (!profile?.profile_completion_status) return 0;
    const sections = Object.values(profile.profile_completion_status);
    const completedSections = sections.filter(Boolean).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const completionPercentage = calculateTotalCompletion();

  const sections = [
    { key: "basic_info", label: "Basic Information" },
    { key: "academic_info", label: "Academic Background" },
    { key: "professional_info", label: "Professional Information" },
    { key: "organization_info", label: "Organization Details" },
    { key: "social_links", label: "Social Links" },
  ];

  if (!profile) return null;

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Profile Completion</h3>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {completionPercentage}% Complete
        </p>
      </div>

      {completionPercentage < 100 && (
        <Alert>
          <AlertDescription>
            Complete your profile to unlock all features and connect with others.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {sections.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {profile.profile_completion_status[key] ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm">{label}</span>
            </div>
            {!profile.profile_completion_status[key] && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => navigate("/profile")}
              >
                Complete <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};