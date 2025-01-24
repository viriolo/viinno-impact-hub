import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ProfileHeaderProps {
  title?: string;
  description?: string;
}

export const ProfileHeader = ({ 
  title = "Profile Settings",
  description = "Customize your profile information and appearance"
}: ProfileHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};