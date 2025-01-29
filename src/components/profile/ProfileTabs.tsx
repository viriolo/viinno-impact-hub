import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorProfile } from "./sections/MentorProfile";
import { ScholarProfile } from "./sections/ScholarProfile";
import { CSRFunderProfile } from "./sections/CSRFunderProfile";
import { NGOProfile } from "./sections/NGOProfile";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Globe, Building2 } from "lucide-react";

interface ProfileTabsProps {
  role?: string;
  profile: any; // Replace with proper type
}

export const ProfileTabs = ({ role, profile }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        {role === "mentor" && <TabsTrigger value="mentor">Mentor Profile</TabsTrigger>}
        {role === "scholar" && <TabsTrigger value="scholar">Scholar Profile</TabsTrigger>}
        {role === "csr_funder" && <TabsTrigger value="csr">CSR Profile</TabsTrigger>}
        {role === "ngo" && <TabsTrigger value="ngo">NGO Profile</TabsTrigger>}
      </TabsList>

      <TabsContent value="about" className="mt-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Bio</Label>
                <p className="mt-1">{profile?.bio || "No bio provided"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Location</Label>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{profile?.location || "Location not set"}</span>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Contact</Label>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{profile?.email || "Email not provided"}</span>
                </div>
              </div>

              {profile?.website && (
                <div>
                  <Label className="text-muted-foreground">Website</Label>
                  <div className="flex items-center mt-1">
                    <Globe className="h-4 w-4 mr-2" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}

              {profile?.organization_name && (
                <div>
                  <Label className="text-muted-foreground">Organization</Label>
                  <div className="flex items-center mt-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>{profile.organization_name}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
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
              </div>

              <div>
                <Label className="text-muted-foreground">Interests</Label>
                <div className="flex flex-wrap gap-2 mt-2">
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
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>

      {role === "mentor" && (
        <TabsContent value="mentor" className="mt-6">
          <MentorProfile profile={profile} />
        </TabsContent>
      )}

      {role === "scholar" && (
        <TabsContent value="scholar" className="mt-6">
          <ScholarProfile profile={profile} />
        </TabsContent>
      )}

      {role === "csr_funder" && (
        <TabsContent value="csr" className="mt-6">
          <CSRFunderProfile profile={profile} />
        </TabsContent>
      )}

      {role === "ngo" && (
        <TabsContent value="ngo" className="mt-6">
          <NGOProfile profile={profile} />
        </TabsContent>
      )}
    </Tabs>
  );
};