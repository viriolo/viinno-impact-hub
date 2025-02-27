
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ThumbsUp, Users } from "lucide-react";
import { SkillWithEndorsements, endorseSkill, removeEndorsement } from "@/services/endorsementService";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SkillsEndorsementsGridProps {
  skills: SkillWithEndorsements[];
  userId: string;
  isCurrentUser?: boolean;
  onRefresh?: () => void;
}

export function SkillsEndorsementsGrid({ 
  skills, 
  userId, 
  isCurrentUser = false,
  onRefresh 
}: SkillsEndorsementsGridProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingSkills, setLoadingSkills] = useState<Record<string, boolean>>({});

  const handleEndorse = async (skill: SkillWithEndorsements) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to endorse skills",
        variant: "destructive",
      });
      return;
    }

    if (isCurrentUser) {
      toast({
        title: "Cannot endorse own skills",
        description: "You cannot endorse your own skills",
        variant: "destructive",
      });
      return;
    }

    setLoadingSkills(prev => ({ ...prev, [skill.id]: true }));

    try {
      if (skill.endorsedByCurrentUser) {
        // Remove endorsement
        const result = await removeEndorsement(
          skill.id,
          userId,
          user.id
        );
        
        if (result.success) {
          toast({
            title: "Endorsement removed",
            description: `You removed your endorsement for ${skill.name}`,
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to remove endorsement",
            variant: "destructive",
          });
        }
      } else {
        // Add endorsement
        const result = await endorseSkill(
          skill.id,
          userId,
          user.id
        );
        
        if (result.success) {
          toast({
            title: "Skill endorsed",
            description: `You endorsed ${skill.name}`,
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to endorse skill",
            variant: "destructive",
          });
        }
      }
      
      // Refresh skills after endorsement change
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error changing endorsement:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSkills(prev => ({ ...prev, [skill.id]: false }));
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="bg-muted/50 p-3 rounded-lg flex flex-col justify-between hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium truncate mr-2">{skill.name}</div>
                {!isCurrentUser && user && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant={skill.endorsedByCurrentUser ? "default" : "outline"}
                          className="h-8 w-8 p-0"
                          onClick={() => handleEndorse(skill)}
                          disabled={loadingSkills[skill.id]}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {skill.endorsedByCurrentUser
                          ? "Remove your endorsement"
                          : "Endorse this skill"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
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
