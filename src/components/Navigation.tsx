import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { protectedRoutes } from "@/config/routes";

export const Navigation = () => {
  const { user } = useAuth();

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