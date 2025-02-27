
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Badge {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  dateAwarded: Date;
}

interface AchievementBadgesCarouselProps {
  badges: Badge[];
}

export function AchievementBadgesCarousel({ badges }: AchievementBadgesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < badges.length - 1 ? prevIndex + 1 : badges.length - 1
    );
  };

  // For touch swipe functionality
  const [touchStart, setTouchStart] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // If the swipe distance is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next
        handleNext();
      } else {
        // Swipe right, go to previous
        handlePrevious();
      }
    }
  };

  if (!badges || badges.length === 0) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No badges have been earned yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievement Badges
          </CardTitle>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === badges.length - 1}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="overflow-hidden"
          ref={carouselRef}
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className="w-full flex-shrink-0 px-2"
              >
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <div className="mb-4 relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                      <img 
                        src={badge.imageUrl} 
                        alt={badge.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Badge';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-center mb-2">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-2">{badge.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Awarded on {badge.dateAwarded.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Indicator dots for mobile */}
        <div className="flex justify-center gap-1 mt-4">
          {badges.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
