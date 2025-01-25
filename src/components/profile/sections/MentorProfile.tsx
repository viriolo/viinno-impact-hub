import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MentorProfileProps {
  profile: any; // Replace with proper type
}

export const MentorProfile = ({ profile }: MentorProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Expertise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Expertise Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.mentor_expertise?.length > 0 ? (
              profile.mentor_expertise.map((expertise: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {expertise}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No expertise areas listed</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.mentor_availability ? (
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(profile.mentor_availability, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No availability set</p>
          )}
        </CardContent>
      </Card>

      {/* Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.impact_metrics ? (
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(profile.impact_metrics, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No impact metrics available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};