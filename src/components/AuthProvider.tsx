import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null,
  isLoading: true 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to handle redirects
  const handleAuthRedirect = (session: Session | null) => {
    const intendedPath = location.state?.from?.pathname;
    if (session) {
      navigate(intendedPath || "/profile", { replace: true });
    } else {
      navigate("/login", { 
        replace: true,
        state: { from: location }
      });
    }
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Session error: " + error.message);
          return;
        }
        
        if (session) {
          setSession(session);
          setUser(session.user);
          // Only redirect on initial load if we're on login/register pages
          const isAuthPage = ['/login', '/register'].includes(location.pathname);
          if (isAuthPage) {
            handleAuthRedirect(session);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Authentication error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      switch (event) {
        case 'SIGNED_IN':
          setSession(session);
          setUser(session?.user ?? null);
          toast.success("Successfully signed in!");
          handleAuthRedirect(session);
          break;

        case 'SIGNED_OUT':
          setSession(null);
          setUser(null);
          toast.info("You have been signed out");
          handleAuthRedirect(null);
          break;

        case 'TOKEN_REFRESHED':
          if (!session) {
            console.error("Token refresh failed");
            toast.error("Your session has expired. Please sign in again.");
            setSession(null);
            setUser(null);
            handleAuthRedirect(null);
          } else {
            setSession(session);
            setUser(session.user);
            console.log("Token successfully refreshed");
          }
          break;

        case 'USER_UPDATED':
          setSession(session);
          setUser(session?.user ?? null);
          toast.success("Profile updated successfully");
          break;

        case 'USER_DELETED':
          setSession(null);
          setUser(null);
          toast.info("Account deleted successfully");
          handleAuthRedirect(null);
          break;

        case 'PASSWORD_RECOVERY':
          toast.info("Password recovery email sent");
          break;

        default:
          if (session) {
            setSession(session);
            setUser(session.user);
          }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};