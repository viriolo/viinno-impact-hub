import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { UserMenu } from "./navigation/UserMenu";
import { AuthButtons } from "./navigation/AuthButtons";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

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

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationContent = (
    <>
      {user && <NavigationLinks userRoles={userRoles} isActiveRoute={isActiveRoute} />}
      <div className="flex items-center space-x-4">
        {user ? (
          <UserMenu userRoles={userRoles} isActiveRoute={isActiveRoute} />
        ) : (
          <AuthButtons />
        )}
      </div>
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 gap-4">
        <Link to="/" className="font-bold text-xl text-primary shrink-0">
          Impact
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col gap-4 pt-6">
                {navigationContent}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex-1 flex items-center justify-between gap-4">
            {navigationContent}
          </div>
        )}
      </div>
    </nav>
  );
};