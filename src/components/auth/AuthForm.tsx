import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
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
        },
      }}
      providers={[]}
      redirectTo={window.location.origin}
    />
  );
};