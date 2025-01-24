import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  title?: string;
  description?: string;
}

export const ProfileHeader = ({ 
  title = "Profile Settings",
  description = "Customize your profile information and appearance"
}: ProfileHeaderProps) => {
  return (
    <CardHeader className="space-y-2">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <CardTitle>{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};