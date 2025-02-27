
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProfileDataExportProps {
  userId: string;
}

export function ProfileDataExport({ userId }: ProfileDataExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Get basic profile data
  const { data: profile } = useQuery({
    queryKey: ["profile-export", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Collect all data from various tables
      const [
        { data: skillEndorsements },
        { data: userAchievements },
        { data: portfolioItems },
        { data: impactCards },
        { data: userRoles },
      ] = await Promise.all([
        supabase
          .from("skill_endorsements")
          .select(`
            skill_id,
            skills (name),
            endorser_id,
            profiles!skill_endorsements_endorser_id_fkey (username)
          `)
          .eq("endorsed_user_id", userId),
        supabase
          .from("user_achievements")
          .select("*, achievements (*)")
          .eq("user_id", userId),
        supabase
          .from("portfolio_items")
          .select("*")
          .eq("user_id", userId),
        supabase
          .from("impact_cards")
          .select("*")
          .eq("user_id", userId),
        supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", userId),
      ]);

      // Structure the data
      const exportData = {
        profile,
        skills: profile?.skills || [],
        skillEndorsements: skillEndorsements || [],
        achievements: userAchievements || [],
        portfolioItems: portfolioItems || [],
        impactCards: impactCards || [],
        roles: userRoles || [],
        exportDate: new Date().toISOString(),
      };

      // Generate the file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Create a download link
      const exportFileDefaultName = `profile-data-${profile?.username || userId}-${new Date().toISOString().slice(0, 10)}.json`;
      
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
