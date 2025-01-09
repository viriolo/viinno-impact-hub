import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-heading font-bold text-primary">Viinno</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/impact">Impact</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/map">Map</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}