
import { Navigation } from "@/components/Navigation";
import { ImpactCardsList } from "@/components/impact-cards/ImpactCardsList";

export default function ImpactCardsDemo() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Impact Cards</h1>
            <p className="text-muted-foreground mt-2">
              Explore projects and their current funding progress
            </p>
          </div>
          
          <ImpactCardsList />
        </div>
      </main>
    </div>
  );
}
