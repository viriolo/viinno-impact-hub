import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const AuthForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="auth-container">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: "hsl(var(--primary))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--primary-foreground))",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  height: "2.5rem",
                  padding: "0.5rem 1rem",
                },
                input: {
                  backgroundColor: "transparent",
                  border: "1px solid hsl(var(--input))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  height: "2.5rem",
                  padding: "0.5rem 0.75rem",
                },
                label: {
                  color: "hsl(var(--foreground))",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                },
                message: {
                  fontSize: "0.875rem",
                  color: "#ef4444",
                },
              },
            }}
            theme="custom"
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
};