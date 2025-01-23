import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthRedirect = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (type === "email_confirmation" && accessToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (error) throw error;

          toast({
            title: "Email confirmed",
            description: "You can now sign in to your account",
          });
          
          window.location.hash = "";
        } catch (error) {
          console.error("Error confirming email:", error);
          toast({
            variant: "destructive",
            title: "Error confirming email",
            description: "Please try signing in again or contact support",
          });
        }
      }
    };

    handleEmailConfirmation();
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' && !session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Invalid login credentials. Please check your email and password.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);
};