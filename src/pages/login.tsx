import { Navigation } from "@/components/Navigation";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LoginPage() {
  useAuthRedirect();

  return (
    <>
      <Navigation />
      <AuthContainer
        title="Welcome Back"
        description="Sign in to your account to continue"
      >
        <AuthForm />
      </AuthContainer>
    </>
  );
}