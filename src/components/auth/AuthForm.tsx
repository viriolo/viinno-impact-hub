import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/profile');
      }
      
      if (event === 'USER_UPDATED' && !session) {
        toast.error("Invalid login credentials. Please check your email and password.");
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }

      if (event === 'PASSWORD_RECOVERY' || event === 'TOKEN_REFRESHED') {
        console.error('Authentication event:', event);
        toast.error('Authentication failed. Please try again.');
      }
    });

    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const error_description = params.get('error_description');
    
    if (error) {
      toast.error(error_description || 'An error occurred during authentication');
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="space-y-6">
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
          style: {
            button: {
              width: "100%",
              padding: "8px 16px",
              backgroundColor: "#1a365d",
              color: "white",
              borderRadius: "0.375rem",
            },
            input: {
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
            },
            message: {
              fontSize: "0.875rem",
              color: "#ef4444",
            },
            anchor: {
              display: "none",
            },
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
        view={isLoginPage ? "sign_in" : "sign_up"}
      />
      {isLoginPage && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};