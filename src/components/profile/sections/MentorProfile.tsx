import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, GraduationCap, Globe, MessageSquare, Video, BookOpen, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MentorProfileProps {
  profile: any; // Replace with proper type
}

export const MentorProfile = ({ profile }: MentorProfileProps) => {
  const { data: mentorshipStats } = useQuery({
    queryKey: ["mentorshipStats", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentorship_sessions")
        .select("*")
        .eq("mentor_id", profile?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

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

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.mentor_education?.length > 0 ? (
            <div className="space-y-4">
              {profile.mentor_education.map((edu: any, index: number) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution} • {edu.year}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No education details available</p>
          )}
        </CardContent>
      </Card>

      {/* Mentorship Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Mentorship Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Scholars Mentored</p>
              <p className="text-2xl font-bold">
                {profile?.mentor_stats?.scholars_mentored || 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">
                {profile?.mentor_stats?.total_hours || 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {profile?.mentor_stats?.average_rating?.toFixed(1) || "N/A"}
                </p>
                {profile?.mentor_stats?.average_rating && (
                  <span className="text-sm text-muted-foreground">/5.0</span>
                )}
              </div>
            </div>
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
            <div className="space-y-4">
              {Object.entries(profile.mentor_availability).map(([day, slots]: [string, any]) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 font-medium">{day}</span>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No availability set</p>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.mentor_languages?.map((lang: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-sm text-muted-foreground">{lang.level}</span>
                </div>
                <Progress value={lang.proficiency} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Testimonials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.mentor_testimonials?.length > 0 ? (
            <div className="space-y-6">
              {profile.mentor_testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="space-y-2">
                  <p className="italic text-muted-foreground">"{testimonial.content}"</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{testimonial.author}</span>
                    <span>•</span>
                    <span className="text-muted-foreground">{testimonial.date}</span>
                  </div>
                  {index < profile.mentor_testimonials.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No testimonials yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};