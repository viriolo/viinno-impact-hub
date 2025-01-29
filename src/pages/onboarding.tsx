import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: onboardingProgress } = useQuery({
    queryKey: ["onboardingProgress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_progress")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (onboardingProgress?.is_completed) {
      navigate("/dashboard");
    }
  }, [onboardingProgress, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <OnboardingFlow />
      </div>
    </div>
  );
}