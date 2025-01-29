import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { user } = useAuth();
  const username = user?.user_metadata?.username || "there";

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <img
          src="/logo.png"
          alt="Viinno"
          className="h-16 mx-auto"
        />
        <h1 className="text-3xl font-bold">
          Hi {username}!
        </h1>
        <p className="text-muted-foreground">
          Welcome to Viinno. Let's get you started by setting up your profile.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onNext} className="w-full max-w-sm">
          Get Started
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}