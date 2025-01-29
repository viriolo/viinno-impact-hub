import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { WelcomeStep } from "./steps/WelcomeStep";
import { RoleSelectionStep } from "./steps/RoleSelectionStep";
import { InterestsStep } from "./steps/InterestsStep";
import { GoalsStep } from "./steps/GoalsStep";
import { ProfileSetupStep } from "./steps/ProfileSetupStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type OnboardingStep = "welcome" | "role" | "interests" | "goals" | "profile" | "completion";

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateProgress = async (step: OnboardingStep, data: any) => {
    try {
      const { error } = await supabase
        .from("onboarding_progress")
        .update({
          current_step: step,
          completed_steps: `array_append(completed_steps, '${currentStep}')`,
          ...data,
        })
        .eq("user_id", user?.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress. Please try again.",
      });
    }
  };

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from("onboarding_progress")
        .update({
          is_completed: true,
          current_step: "completion",
        })
        .eq("user_id", user?.id);

      if (error) throw error;
      
      toast({
        title: "Welcome to Viinno!",
        description: "Your profile has been set up successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <WelcomeStep
            onNext={() => {
              updateProgress("role", {});
              setCurrentStep("role");
            }}
          />
        );
      case "role":
        return (
          <RoleSelectionStep
            onNext={(role) => {
              updateProgress("interests", { selected_role: role });
              setCurrentStep("interests");
            }}
            onBack={() => setCurrentStep("welcome")}
          />
        );
      case "interests":
        return (
          <InterestsStep
            onNext={(interests) => {
              updateProgress("goals", { interests });
              setCurrentStep("goals");
            }}
            onBack={() => setCurrentStep("role")}
          />
        );
      case "goals":
        return (
          <GoalsStep
            onNext={(goals) => {
              updateProgress("profile", { goals });
              setCurrentStep("profile");
            }}
            onBack={() => setCurrentStep("interests")}
          />
        );
      case "profile":
        return (
          <ProfileSetupStep
            onNext={(profileData) => {
              updateProgress("completion", { profile_data: profileData });
              setCurrentStep("completion");
            }}
            onBack={() => setCurrentStep("goals")}
          />
        );
      case "completion":
        return <CompletionStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderStep()}
    </div>
  );
}