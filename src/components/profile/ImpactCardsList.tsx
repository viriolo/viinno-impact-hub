import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ImpactCard {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
}

export const ImpactCardsList = ({ userId }: { userId?: string }) => {
  const { data: impactCards, isLoading } = useQuery({
    queryKey: ["impact-cards", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_cards")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "published")
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-48">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (!impactCards?.length) {
    return (
      <Card className="col-span-3">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No impact cards created yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {impactCards.map((card: ImpactCard) => (
        <Link to={`/impact-cards/${card.id}`} key={card.id}>
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {card.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
};