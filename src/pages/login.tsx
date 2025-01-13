import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

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

  // Listen for auth state changes to handle errors
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#1a365d",
                      brandAccent: "#2d73b9",
                    },
                  },
                },
                className: {
                  container: "space-y-4",
                  button: "w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90",
                  input: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary",
                  message: "text-sm text-red-500",
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}