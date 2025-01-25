import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, Globe, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NGOProfileProps {
  profile: any; // Replace with proper type
}

export const NGOProfile = ({ profile }: NGOProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Name</h4>
            <p className="text-sm text-muted-foreground">
              {profile?.organization_name || "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Type</h4>
            <p className="text-sm text-muted-foreground">
              {profile?.organization_type || "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {profile?.organization_description || "No description provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expertise Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            NGO Expertise Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.ngo_expertise_areas?.length > 0 ? (
              profile.ngo_expertise_areas.map((area: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {area}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No expertise areas specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Collaborations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Project Collaborations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.project_collaborations ? (
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(profile.project_collaborations, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No collaborations yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};