import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityErrorProps {
  error: Error;
  onRetry: () => void;
}

export function ActivityError({ error, onRetry }: ActivityErrorProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Error Loading Activities</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {error.message}
        </p>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="w-full"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}