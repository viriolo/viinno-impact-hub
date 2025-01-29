import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Check className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">You're All Set!</h2>
        <p className="text-muted-foreground">
          Your profile has been created successfully. You're ready to start exploring
          Viinno and connecting with others.
        </p>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onComplete} className="w-full max-w-sm">
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
}