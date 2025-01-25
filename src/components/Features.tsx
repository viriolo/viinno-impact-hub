import { Suspense, lazy } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Users, BarChart3, Award, BookOpen, MessageSquare, Rocket, Target, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load feature cards in chunks
const FeatureCard = lazy(() => import("./feature-cards/FeatureCard"));

const features = [
  {
    title: "Global Impact Tracking",
    description: "Visualize and measure your impact across the globe with our interactive mapping system.",
    icon: Globe2,
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "Scholar Community",
    description: "Connect with fellow scholars, share experiences, and collaborate on impactful projects.",
    icon: Users,
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    title: "Smart Matching",
    description: "AI-powered recommendations for projects, mentors, and collaboration opportunities.",
    icon: Sparkles,
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "Resource Library",
    description: "Access a comprehensive repository of knowledge, best practices, and learning materials.",
    icon: BookOpen,
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Communication Hub",
    description: "Integrated messaging and collaboration tools to connect with mentors and peers.",
    icon: MessageSquare,
    gradient: "from-red-500/10 to-rose-500/10",
  },
  {
    title: "Project Showcase",
    description: "Present your initiatives and seek support from mentors, CSR funders, and NGOs.",
    icon: Rocket,
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    title: "Impact Analytics",
    description: "Track and analyze your contributions with detailed metrics and visualizations.",
    icon: BarChart3,
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
  {
    title: "Achievement System",
    description: "Earn recognition and track your progress with badges and milestone rewards.",
    icon: Award,
    gradient: "from-teal-500/10 to-green-500/10",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4 leading-tight">
            Empowering Australia Awards Scholars
            <br />
            to Create Global Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with mentors, CSR funders, and NGOs to amplify your impact and contribute to meaningful international development initiatives.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Suspense fallback={<LoadingSpinner />}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
