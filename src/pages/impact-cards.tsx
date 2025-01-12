import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Share2, MapPin, Edit, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

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
  const [filteredCards, setFilteredCards] = useState<ImpactCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    filterCards();
  }, [searchTerm, locationFilter, cards]);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCards(data || []);
      setFilteredCards(data || []);
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

  const filterCards = () => {
    let filtered = [...cards];
    
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(card => 
        card.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    setFilteredCards(filtered);
  };

  const handleShare = async (cardId: string) => {
    try {
      await supabase
        .from("impact_cards")
        .update({ shares: cards.find(c => c.id === cardId)?.shares + 1 })
        .eq("id", cardId);

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

  const handleEdit = (cardId: string) => {
    navigate(`/edit-impact-card/${cardId}`);
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

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(card.id)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(card.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {cards.length === 0 
              ? "No impact cards yet. Create your first one!"
              : "No cards match your search criteria."}
          </p>
          {cards.length === 0 && (
            <Link to="/create-impact-card">
              <Button className="mt-4">
                <Plus className="mr-2 h-5 w-5" />
                Create Impact Card
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}