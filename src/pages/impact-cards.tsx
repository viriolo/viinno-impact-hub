import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Share2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImpactCard {
  id: string;
  title: string;
  description: string;
  media_url: string | null;
  location: string | null;
  created_at: string;
  views: number;
  shares: number;
}

export default function ImpactCards() {
  const [cards, setCards] = useState<ImpactCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCards(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load impact cards.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (cardId: string) => {
    try {
      await supabase
        .from("impact_cards")
        .update({ shares: cards.find(c => c.id === cardId)?.shares + 1 })
        .eq("id", cardId);

      // Update local state
      setCards(cards.map(card =>
        card.id === cardId
          ? { ...card, shares: card.shares + 1 }
          : card
      ));

      toast({
        title: "Shared!",
        description: "Impact card has been shared.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share impact card.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Impact Cards</h1>
        <Link to="/create-impact-card">
          <Button>
            <Plus className="mr-2 h-5 w-5" />
            Create Impact Card
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className="card-hover">
            <CardHeader>
              <CardTitle className="text-xl">{card.title}</CardTitle>
              {card.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{card.location}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {card.media_url && (
                <img
                  src={card.media_url}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-muted-foreground mb-4">{card.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{card.views} views</span>
                  <span>{card.shares} shares</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(card.id)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No impact cards yet. Create your first one!</p>
          <Link to="/create-impact-card">
            <Button className="mt-4">
              <Plus className="mr-2 h-5 w-5" />
              Create Impact Card
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}