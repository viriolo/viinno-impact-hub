
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpactCardsFallbackProps {
  onRetry: () => void;
  error?: string;
}

export const ImpactCardsFallback = ({ 
  onRetry, 
  error = 'Failed to load impact cards—please try again.'
}: ImpactCardsFallbackProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit mt-2"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
