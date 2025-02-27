
import { useImpactCards } from "@/hooks/useImpactCards";
import { ImpactCard } from "./ImpactCard";
import { ImpactCardsFallback } from "@/components/ui/impact-cards/ImpactCardsFallback";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-muted-foreground">No impact cards found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {impactCards.map((card) => (
        <ImpactCard key={card.id} card={card} />
      ))}
    </div>
  );
};
