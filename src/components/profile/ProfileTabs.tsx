
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScholarProfile } from "@/components/profile/sections/ScholarProfile";
import { MentorProfile } from "@/components/profile/sections/MentorProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CircleUser, Star } from "lucide-react";
import { SkillWithEndorsements } from "@/services/endorsementService";

interface ProfileTabsProps {
  role?: string;
  profile?: any;
}

export function ProfileTabs({ role, profile }: ProfileTabsProps) {
  const defaultTab = role === "mentor" ? "mentor" : "scholar";

  const mockSkillsWithEndorsements: SkillWithEndorsements[] = (profile?.skills || []).map((skill: string, index: number) => ({
    id: `skill-${index}`,
    name: skill,
    endorsements: Math.floor(Math.random() * 15),
    endorsedByCurrentUser: Math.random() > 0.7
  }));

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="scholar">Scholar Profile</TabsTrigger>
        {role === "mentor" && <TabsTrigger value="mentor">Mentor Profile</TabsTrigger>}
      </TabsList>
      <TabsContent value="scholar" className="mt-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CircleUser className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile?.bio || "No bio provided"}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Professional Background
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile?.professional_background || "No professional background provided"}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Top Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {mockSkillsWithEndorsements.slice(0, 5).map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                    {skill.name}
                    {skill.endorsements > 0 && (
                      <span className="ml-1 bg-primary/10 text-primary text-xs px-1 rounded">
                        {skill.endorsements}
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed</p>
            )}
          </CardContent>
        </Card>

        <ScholarProfile profile={profile} />
      </TabsContent>
      {role === "mentor" && (
        <TabsContent value="mentor" className="mt-6">
          <MentorProfile profile={profile} />
        </TabsContent>
      )}
    </Tabs>
  );
}
