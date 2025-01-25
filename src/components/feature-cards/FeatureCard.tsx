import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
  };
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;
  
  return (
    <Card className="relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50`} />
      <CardHeader className="relative">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-gray-600 text-base">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;