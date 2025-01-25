import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavigationLinks } from "./NavigationLinks";
import { UserMenu } from "./UserMenu";
import { AuthButtons } from "./AuthButtons";
import { Database } from "@/integrations/supabase/types";

interface MobileNavigationProps {
  user: boolean;
  userRoles?: Database["public"]["Enums"]["app_role"][];
  isActiveRoute: (path: string) => boolean;
}

export const MobileNavigation = ({ user, userRoles, isActiveRoute }: MobileNavigationProps) => {
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
  );
};