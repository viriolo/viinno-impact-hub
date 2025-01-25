import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { protectedRoutes } from "@/config/routes";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Plus, 
  FileText 
} from "lucide-react";

interface NavigationLinksProps {
  userRoles?: Database["public"]["Enums"]["app_role"][];
  isActiveRoute: (path: string) => boolean;
}

export const NavigationLinks = ({ userRoles, isActiveRoute }: NavigationLinksProps) => {
  const getIconForRoute = (path: string) => {
    switch (path) {
      case "/dashboard":
        return <LayoutDashboard className="h-4 w-4" />;
      case "/map":
        return <MapIcon className="h-4 w-4" />;
      case "/create-impact-card":
        return <Plus className="h-4 w-4" />;
      case "/impact-cards":
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const hasRequiredRole = (allowedRoles?: Database["public"]["Enums"]["app_role"][]) => {
    if (!allowedRoles || !userRoles) return false;
    return userRoles.some(role => allowedRoles.includes(role));
  };

  return (
    <div className="flex items-center space-x-1">
      {protectedRoutes.map((route) => (
        hasRequiredRole(route.allowedRoles) && (
          <Button
            key={route.path}
            variant={isActiveRoute(route.path) ? "default" : "ghost"}
            asChild
            className={cn(
              "transition-colors",
              isActiveRoute(route.path) && "bg-primary text-primary-foreground",
              !isActiveRoute(route.path) && "hover:bg-primary/10"
            )}
          >
            <Link to={route.path} className="flex items-center gap-2">
              {getIconForRoute(route.path)}
              {route.title}
            </Link>
          </Button>
        )
      ))}
    </div>
  );
};