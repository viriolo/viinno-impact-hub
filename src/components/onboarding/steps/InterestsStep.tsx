import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface InterestsStepProps {
  onNext: (interests: string[]) => void;
  onBack: () => void;
}

const interests = [
  "Sustainable Development",
  "Education",
  "Health & Wellbeing",
  "Environmental Conservation",
  "Economic Growth",
  "Technology & Innovation",
  "Cultural Exchange",
  "Policy & Governance",
];

export function InterestsStep({ onNext, onBack }: InterestsStepProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Areas of Interest</h2>
        <p className="text-muted-foreground">
          Select the areas that align with your interests and goals
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <Button
              key={interest}
              variant={isSelected ? "default" : "outline"}
              className="h-auto p-4 justify-start space-x-2"
              onClick={() => toggleInterest(interest)}
            >
              {isSelected && <Check className="h-4 w-4" />}
              <span>{interest}</span>
            </Button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <Button
          onClick={() => onNext(selectedInterests)}
          disabled={selectedInterests.length === 0}
        >
          Continue
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}