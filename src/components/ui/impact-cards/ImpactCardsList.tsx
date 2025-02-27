
import { useImpactCards } from "@/hooks/useImpactCards";
import { ImpactCardsFallback } from "./ImpactCardsFallback";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const ImpactCardsList = () => {
  const { impactCards, isLoading, isError, refetch } = useImpactCards();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ImpactCardsFallback onRetry={refetch} />;
  }

  if (impactCards.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No impact cards found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {impactCards.map((card) => (
        <Card key={card.id} className="overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl line-clamp-2">{card.title}</CardTitle>
              {card.category && (
                <Badge variant="outline" className="ml-2 whitespace-nowrap">
                  {card.category}
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-3">
              {card.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {card.location && (
              <p className="text-sm text-muted-foreground mb-2">
                Location: {card.location}
              </p>
            )}
            
            {card.goal_amount && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {card.current_amount ? `$${card.current_amount}` : "$0"} of ${card.goal_amount}
                  </span>
                </div>
                <Progress 
                  value={card.current_amount && card.goal_amount 
                    ? (card.current_amount / card.goal_amount) * 100 
                    : 0} 
                  className="h-2" 
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
            <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
            {card.views && <span>Views: {card.views}</span>}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
