import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Navigation } from "@/components/Navigation";
import { Suspense } from "react";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
      </Suspense>
    </div>
  );
}