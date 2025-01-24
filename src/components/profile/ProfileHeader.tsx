import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  title?: string;
  description?: string;
  avatarUrl?: string;
  username?: string;
  location?: string;
  impactPoints?: number;
  isEditable?: boolean;
}

export const ProfileHeader = ({ 
  avatarUrl,
  username = "User",
  location = "Location not set",
  impactPoints = 0,
  isEditable = false
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 border-b">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>
          <User className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{username}</h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          {isEditable && (
            <Button variant="outline">Edit Profile</Button>
          )}
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-muted-foreground">Impact Points</div>
          <div className="text-xl font-semibold">{impactPoints}</div>
        </div>
      </div>
    </div>
  );
};