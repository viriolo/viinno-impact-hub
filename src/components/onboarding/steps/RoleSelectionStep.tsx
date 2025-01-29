import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, GraduationCap, Users, Building2, Shield } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["app_role"];

interface RoleSelectionStepProps {
  onNext: (role: UserRole) => void;
  onBack: () => void;
}

const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "scholar",
    title: "Scholar/Alumni",
    description: "Connect with peers, showcase impact, and find opportunities",
    icon: <GraduationCap className="h-6 w-6" />,
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Guide and support scholars in their journey",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: "csr_funder",
    title: "Organization Representative",
    description: "Partner with scholars and support initiatives",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    id: "ngo",
    title: "Program Administrator",
    description: "Manage and track program impact",
    icon: <Shield className="h-6 w-6" />,
  },
];

export function RoleSelectionStep({ onNext, onBack }: RoleSelectionStepProps) {
  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Choose Your Role</h2>
        <p className="text-muted-foreground">
          Select the role that best describes your participation in the platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Button
            key={role.id}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center text-center space-y-2"
            onClick={() => onNext(role.id)}
          >
            {role.icon}
            <span className="font-semibold">{role.title}</span>
            <span className="text-sm text-muted-foreground">
              {role.description}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
      </div>
    </Card>
  );
}