import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-2">
      <Button asChild variant="ghost">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
};