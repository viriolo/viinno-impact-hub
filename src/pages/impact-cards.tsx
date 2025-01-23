import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Share2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "@/components/impact-cards/search-filters";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ImpactCard {
  id: string;
  title: string;
  description: string;
  location: string;
  media_url: string;
  views: number;
  shares: number;
}

export default function ImpactCardsPage() {
  const [impactCards, setImpactCards] = useState<ImpactCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchImpactCards();
  }, []);

  const fetchImpactCards = async () => {
    try {
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .eq("status", "published");

      if (error) throw error;

      setImpactCards(data || []);
    } catch (error) {
      console.error("Error fetching impact cards:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load impact cards",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("impact_cards")
        .update({ shares: impactCards.find(card => card.id === cardId)?.shares + 1 })
        .eq("id", cardId);

      if (error) throw error;

      setImpactCards(cards =>
        cards.map(card =>
          card.id === cardId
            ? { ...card, shares: card.shares + 1 }
            : card
        )
      );

      toast({
        title: "Shared successfully",
        description: "Impact card has been shared",
      });
    } catch (error) {
      console.error("Error sharing impact card:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share impact card",
      });
    }
  };

  const filteredCards = impactCards.filter(card => {
    const matchesSearch = (
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesLocation = card.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Impact Cards</h1>
        <Button asChild>
          <Link to="/create-impact-card">
            <Plus className="mr-2 h-4 w-4" /> Create Impact Card
          </Link>
        </Button>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        locationFilter={locationFilter}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onLocationChange={(e) => setLocationFilter(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card key={card.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{card.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(card.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/edit-impact-card/${card.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-4">{card.description}</p>
              {card.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Location: {card.location}
                </p>
              )}
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>{card.views} views</span>
                <span>{card.shares} shares</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}