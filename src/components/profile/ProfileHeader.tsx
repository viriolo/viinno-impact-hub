import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, MapPin, MessageCircle, ExternalLink, Shield, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  title?: string;
  description?: string;
  avatarUrl?: string;
  username?: string;
  location?: string;
  impactPoints?: number;
  isEditable?: boolean;
  isLoading?: boolean;
  isVerified?: boolean;
  role?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const ProfileHeader = ({ 
  avatarUrl,
  username = "User",
  location = "Location not set",
  impactPoints = 0,
  isEditable = false,
  isLoading = false,
  isVerified = false,
  role = "Scholar",
  socialLinks = {}
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 border-b">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        {isVerified && (
          <Badge variant="secondary" className="absolute -bottom-2 -right-2">
            <Shield className="h-4 w-4 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{username}</h2>
              <Badge variant="outline">{role}</Badge>
            </div>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditable ? (
              <Button variant="outline" disabled={isLoading}>
                {isLoading ? "Loading..." : "Edit Profile"}
              </Button>
            ) : (
              <Button variant="default">
                <MessageCircle className="h-4 w-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">{impactPoints}</span>
            <span className="text-muted-foreground ml-1">Impact Score</span>
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};