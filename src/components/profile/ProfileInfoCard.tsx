
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, UserPlus, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileInfoCardProps {
  username?: string;
  role?: string;
  isVerified?: boolean;
  stats: {
    impactPoints: number;
    connections: number;
    following: number;
  };
  onMessage: () => void;
  onConnect: () => void;
  isCurrentUser?: boolean;
}

export function ProfileInfoCard({
  username,
  role,
  isVerified,
  stats,
  onMessage,
  onConnect,
  isCurrentUser = false
}: ProfileInfoCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${username || 'avatar'}`} 
              alt={username || "User"} 
            />
            <AvatarFallback>
              {username ? username[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{username || "User"}</h3>
              {isVerified && (
                <Shield className="h-4 w-4 text-blue-500 ml-1" />
              )}
            </div>
            {role && (
              <p className="text-muted-foreground text-sm">{role}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-6">
          <div className="bg-muted/50 rounded-md p-2">
            <div className="font-semibold">{stats.impactPoints}</div>
            <div className="text-xs text-muted-foreground">Impact Points</div>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <div className="font-semibold">{stats.connections}</div>
            <div className="text-xs text-muted-foreground">Connections</div>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <div className="font-semibold">{stats.following}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>

        {!isCurrentUser && (
          <div className="flex gap-2 mt-2">
            <Button variant="default" className="w-full" onClick={onMessage}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" className="w-full" onClick={onConnect}>
              <UserPlus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
