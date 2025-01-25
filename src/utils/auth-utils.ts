import { Session } from "@supabase/supabase-js";
import { Location } from "react-router-dom";

export const handleAuthRedirect = (
  session: Session | null,
  navigate: (path: string, options?: any) => void,
  location: Location
) => {
  const intendedPath = location.state?.from?.pathname;
  if (session) {
    navigate(intendedPath || "/profile", { replace: true });
  } else {
    navigate("/login", { 
      replace: true,
      state: { from: location }
    });
  }
};