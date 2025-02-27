
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users } from "lucide-react";

interface Skill {
  name: string;
  endorsements: number;
}

interface SkillsEndorsementsGridProps {
  skills: Skill[];
}

export function SkillsEndorsementsGrid({ skills }: SkillsEndorsementsGridProps) {
  if (!skills || skills.length === 0) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Skills Endorsements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No skills have been added to this profile yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Skills Endorsements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div 
              key={skill.name}
              className="bg-muted/50 p-3 rounded-lg flex flex-col justify-between hover:bg-muted transition-colors"
            >
              <div className="font-medium mb-1 truncate">{skill.name}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 mr-1 text-primary" />
                <span>{skill.endorsements} endorsements</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
