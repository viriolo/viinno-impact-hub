
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProfileDataExportProps {
  userId: string;
}

// Define a type for the profile data
interface ProfileData {
  id: string;
  username?: string | null;
  skills?: string[] | null;
  // Add other properties as needed
}

export function ProfileDataExport({ userId }: ProfileDataExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Get basic profile data
  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["profile-export", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      // Return at least the ID to match the ProfileData interface
      return data ? data : { id: userId };
    },
    enabled: !!userId,
  });

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Use simpler approach that doesn't rely on database tables 
      // that might not be available in the current database schema
      const profileData = profile || { id: userId };
      
      // Get user roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId);
      
      // Get impact cards
      const { data: impactCards } = await supabase
        .from("impact_cards")
        .select("*")
        .eq("user_id", userId);

      // Structure the data
      const exportData = {
        profile: profileData,
        skills: profileData.skills || [],
        roles: roles || [],
        impactCards: impactCards || [],
        exportDate: new Date().toISOString(),
      };

      // Generate the file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Create a download link with a safe fallback for username
      const exportFileDefaultName = `profile-data-${profileData.username || userId}-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export successful",
        description: "Your profile data has been exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting your data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center"
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Export Profile Data"}
    </Button>
  );
}
