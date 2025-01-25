import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleAuthRedirect } from "@/utils/auth-utils";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
          const isAuthPage = ['/login', '/register'].includes(location.pathname);
          if (isAuthPage) {
            handleAuthRedirect(session, navigate, location);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      switch (event) {
        case 'SIGNED_IN':
          setSession(session);
          setUser(session?.user ?? null);
          toast.success("Successfully signed in!");
          handleAuthRedirect(session, navigate, location);
          break;

        case 'SIGNED_OUT':
          setSession(null);
          setUser(null);
          toast.info("You have been signed out");
          handleAuthRedirect(null, navigate, location);
          break;

        case 'TOKEN_REFRESHED':
          if (!session) {
            console.error("Token refresh failed");
            toast.error("Your session has expired. Please sign in again.");
            setSession(null);
            setUser(null);
            handleAuthRedirect(null, navigate, location);
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

  return { user, session, isLoading };
};