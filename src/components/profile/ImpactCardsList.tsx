import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ImpactCard {
  id: string;
  title: string;
  description: string;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Impact Cards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : impactCards && impactCards.length > 0 ? (
            impactCards.map((card: ImpactCard) => (
              <Card key={card.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              No impact cards created yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};