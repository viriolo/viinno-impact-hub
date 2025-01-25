import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Book, Target, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScholarProfileProps {
  profile: any; // Replace with proper type
}

export const ScholarProfile = ({ profile }: ScholarProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Academic Background */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Academic Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {profile?.academic_background || "No academic background provided"}
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.length > 0 ? (
              profile.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.interests?.length > 0 ? (
              profile.interests.map((interest: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No interests listed</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mentorship */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Mentorship
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Mentorship section coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};