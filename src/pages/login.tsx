import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";

export default function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

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
                theme: "light",
                variables: {
                  default: {
                    colors: {
                      brand: "#1a365d",
                      brandAccent: "#2d73b9",
                    },
                  },
                },
              }}
              providers={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}