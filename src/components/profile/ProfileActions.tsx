import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface ProfileActionsProps {
  isSubmitting: boolean;
  onSubmit?: () => void;
}

export const ProfileActions = ({ isSubmitting, onSubmit }: ProfileActionsProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={isSubmitting}
      onClick={onSubmit}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
};