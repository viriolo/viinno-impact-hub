import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Globe2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Hero() {
  const { toast } = useToast();

  const handleJoinClick = () => {
    toast({
      title: "Welcome!",
      description: "We're excited to have you join our community.",
    });
  };

  return (
    <div className="hero-gradient min-h-[90vh] flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <AspectRatio ratio={16 / 9} className="h-full">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1920"
            alt="Background"
            className="object-cover object-center"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/90" />
        </AspectRatio>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Globe2 className="h-4 w-4" />
            <span className="hidden sm:inline">Join scholars from over 50 countries</span>
            <span className="sm:hidden">50+ countries</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Australia Awards Scholar
            <br className="hidden sm:block" />
            Impact Platform
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed px-4">
            Connect, collaborate, and showcase your impact as an Australia Awards scholar. Join a community of changemakers making a difference globally.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 group transition-all duration-300 transform hover:translate-y-[-2px]" 
              asChild
              onClick={handleJoinClick}
            >
              <Link to="/register" className="flex items-center gap-2">
                Join the Community
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm transform hover:translate-y-[-2px]" 
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