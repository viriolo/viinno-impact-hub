import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle email confirmation
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
          
          // Clear the URL hash
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
  }, [location, toast]);

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(15 23 42)',
                    brandAccent: 'rgb(51 65 85)',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  password_input_placeholder: "Create a password",
                  confirmation_text: "Confirm password",
                  confirmation_placeholder: "Re-enter your password",
                },
              },
            }}
            providers={[]}
            view="sign_in"
          />
        </div>
      </div>
    </div>
  );
}