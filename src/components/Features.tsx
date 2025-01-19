import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Users, BarChart3, Award } from "lucide-react";

const features = [
  {
    title: "Global Impact Tracking",
    description: "Visualize and measure your impact across the globe through our interactive mapping system.",
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
    title: "Impact Analytics",
    description: "Track and analyze your contributions with detailed metrics and visualizations.",
    icon: BarChart3,
    gradient: "from-orange-500/10 to-red-500/10",
  },
  {
    title: "Recognition System",
    description: "Earn recognition for your achievements and contributions to the community.",
    icon: Award,
    gradient: "from-green-500/10 to-emerald-500/10",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4 leading-tight">
            Empowering Scholars to
            <br />
            Make a Global Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the tools and features designed to help you maximize your impact as an Australia Awards scholar.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50`} />
              <CardHeader className="relative">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}