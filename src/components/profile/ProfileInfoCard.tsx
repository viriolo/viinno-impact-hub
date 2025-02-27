
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Check, MessageSquare, UserPlus } from "lucide-react";

interface ProfileInfoCardProps {
  username: string | null;
  role: string | null;
  isVerified?: boolean;
  stats: {
    impactPoints: number;
    connections: number;
    following: number;
  };
  onMessage?: () => void;
  onConnect?: () => void;
}

export function ProfileInfoCard({
  username,
  role,
  isVerified = false,
  stats,
  onMessage,
  onConnect
}: ProfileInfoCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{username || 'User'}</h2>
          {isVerified && (
            <Check className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {role && (
            <Badge variant="secondary" className="text-sm">
              {role}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {stats.impactPoints}
            </div>
            <div className="text-sm text-muted-foreground">
              Impact Points
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {stats.connections}
            </div>
            <div className="text-sm text-muted-foreground">
              Connections
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {stats.following}
            </div>
            <div className="text-sm text-muted-foreground">
              Following
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          onClick={onMessage}
          variant="default"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>
        <Button
          className="flex-1"
          onClick={onConnect}
          variant="outline"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
