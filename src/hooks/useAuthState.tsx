import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Authentication error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success("Successfully signed in!");
      } else if (event === 'SIGNED_OUT') {
        toast.info("You have been signed out");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading };
};