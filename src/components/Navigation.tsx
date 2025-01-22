import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Map as MapIcon, Plus, FileText } from "lucide-react";
import { protectedRoutes } from "@/config/routes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export const Navigation = () => {
  const { user } = useAuth();

  const { data: userRoles } = useQuery({
    queryKey: ["userRoles", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map(r => r.role as Database["public"]["Enums"]["app_role"]);
    },
    enabled: !!user?.id,
  });

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
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="font-bold">
          Impact
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {protectedRoutes.map((route) => (
                  hasRequiredRole(route.allowedRoles) && (
                    <Button
                      key={route.path}
                      variant="ghost"
                      asChild
                      className="hover:bg-primary/5"
                    >
                      <Link to={route.path} className="flex items-center gap-2">
                        {getIconForRoute(route.path)}
                        {route.title}
                      </Link>
                    </Button>
                  )
                ))}
                <div className="flex items-center space-x-4 border-l pl-4">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                </div>
              </>
            ) : (
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};