import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="hero-gradient min-h-[80vh] flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/photo-1519389950473-47ba0277781c')] bg-cover bg-center opacity-10" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-float">
            Australia Awards Scholar Impact Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Connect, collaborate, and showcase your impact as an Australia Awards scholar. Join a community of changemakers making a difference globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
              <Link to="/register">Join the Community</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white hover:text-primary transition-colors" 
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}