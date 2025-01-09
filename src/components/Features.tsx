import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, Users, BarChart3, Award } from "lucide-react";

const features = [
  {
    title: "Global Impact Tracking",
    description: "Visualize and measure your impact across the globe through our interactive mapping system.",
    icon: Globe2,
  },
  {
    title: "Scholar Community",
    description: "Connect with fellow scholars, share experiences, and collaborate on impactful projects.",
    icon: Users,
  },
  {
    title: "Impact Analytics",
    description: "Track and analyze your contributions with detailed metrics and visualizations.",
    icon: BarChart3,
  },
  {
    title: "Recognition System",
    description: "Earn recognition for your achievements and contributions to the community.",
    icon: Award,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the tools and features designed to help you maximize your impact as an Australia Awards scholar.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
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