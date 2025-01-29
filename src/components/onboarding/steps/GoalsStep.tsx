import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GoalsStepProps {
  onNext: (goals: { shortTerm: string; longTerm: string }) => void;
  onBack: () => void;
}

export function GoalsStep({ onNext, onBack }: GoalsStepProps) {
  const [goals, setGoals] = useState({
    shortTerm: "",
    longTerm: "",
  });

  const isValid = goals.shortTerm.trim() && goals.longTerm.trim();

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Set Your Goals</h2>
        <p className="text-muted-foreground">
          Define your short-term and long-term objectives
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortTerm">Short-term Goals</Label>
          <Textarea
            id="shortTerm"
            placeholder="What do you want to achieve in the next 6 months?"
            value={goals.shortTerm}
            onChange={(e) =>
              setGoals((prev) => ({ ...prev, shortTerm: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longTerm">Long-term Goals</Label>
          <Textarea
            id="longTerm"
            placeholder="What do you want to achieve in the next 2-5 years?"
            value={goals.longTerm}
            onChange={(e) =>
              setGoals((prev) => ({ ...prev, longTerm: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <Button onClick={() => onNext(goals)} disabled={!isValid}>
          Continue
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}