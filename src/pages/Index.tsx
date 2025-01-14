import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useAuth } from "@/components/AuthProvider";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Features />
        {user && (
          <div className="container mx-auto px-4 py-8">
            <ActivityFeed />
          </div>
        )}
      </main>
    </div>
  );
}