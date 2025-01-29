import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/profile');
      }
      
      if (event === 'USER_UPDATED' && !session) {
        toast.error("Invalid login credentials. Please check your email and password.");
      }
      
      // Handle specific error cases
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }

      // Handle authentication errors
      if (event === 'PASSWORD_RECOVERY' || event === 'TOKEN_REFRESHED') {
        console.error('Authentication event:', event);
        toast.error('Authentication failed. Please try again.');
      }
    });

    // Check if there's an error in the URL (from email confirmation)
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
          anchor: "text-primary hover:text-primary/80",
        },
      }}
      providers={[]}
      redirectTo={`${window.location.origin}/auth/callback`}
      view={isLoginPage ? "sign_in" : "sign_up"}
    />
  );
};
