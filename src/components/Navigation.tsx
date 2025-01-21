import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, LogOut } from "lucide-react";
import { protectedRoutes } from "@/config/routes";

export function Navigation() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Viinno
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {protectedRoutes.map((route) => (
                  <Button
                    key={route.path}
                    variant="ghost"
                    asChild
                    className="hover:bg-primary/5"
                  >
                    <Link to={route.path} className="flex items-center gap-2">
                      {route.path === "/dashboard" && <LayoutDashboard className="h-4 w-4" />}
                      {route.title}
                    </Link>
                  </Button>
                ))}
                <div className="flex items-center space-x-4 border-l pl-4">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 hover:bg-destructive/5 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="default" asChild className="shadow-md hover:shadow-lg transition-shadow">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}