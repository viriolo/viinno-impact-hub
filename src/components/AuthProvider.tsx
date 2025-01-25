import { createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null,
  isLoading: true 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthState();

  if (authState.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};