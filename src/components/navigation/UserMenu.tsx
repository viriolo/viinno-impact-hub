import { Link } from "react-router-dom";
import { User, GraduationCap, Building2, Briefcase, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  userRoles?: Database["public"]["Enums"]["app_role"][];
  isActiveRoute: (path: string) => boolean;
}

export const UserMenu = ({ userRoles, isActiveRoute }: UserMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getRoleIcon = (role: Database["public"]["Enums"]["app_role"]) => {
    switch (role) {
      case "scholar":
        return <GraduationCap className="h-4 w-4" />;
      case "mentor":
        return <Building2 className="h-4 w-4" />;
      case "csr_funder":
        return <Briefcase className="h-4 w-4" />;
      case "ngo":
        return <Heart className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4 border-l pl-4">
      <Button
        variant={isActiveRoute("/profile") ? "default" : "ghost"}
        asChild
        className={cn(
          "transition-colors",
          isActiveRoute("/profile") && "bg-primary text-primary-foreground",
          !isActiveRoute("/profile") && "hover:bg-primary/10"
        )}
      >
        <Link to="/profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </Link>
      </Button>
      <div className="flex flex-col items-end">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <div className="flex gap-2 mt-1">
          {userRoles?.map((role) => (
            <Badge 
              key={role} 
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {getRoleIcon(role)}
              {role.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};