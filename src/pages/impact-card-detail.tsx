import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Heart, Share2, HandHelping } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MapContainer from "@/components/map/MapContainer";
import { ImpactCard } from "@/integrations/supabase/types/models.types";
import mapboxgl from 'mapbox-gl';

type ExtendedImpactCard = ImpactCard & {
  profiles: {
    username: string | null;
    avatar_url: string | null;
    professional_background: string | null;
  } | null;
}

const ImpactCardDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: impactCard, isLoading } = useQuery({
    queryKey: ["impact-card", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_cards")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            professional_background
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Impact card not found");
      
      return data as ExtendedImpactCard;
    },
  });

  const handleSupport = () => {
    toast({
      title: "Support registered",
      description: "Thank you for supporting this initiative!",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: impactCard?.title,
        text: impactCard?.description,
        url: window.location.href,
      });
    } catch (error) {
      toast({
        title: "Copied to clipboard",
        description: "Link has been copied to your clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-40 bg-gray-200 rounded mb-4" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!impactCard) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Impact card not found</h1>
      </div>
    );
  }

  const images = impactCard.media_url ? [impactCard.media_url] : [];

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{impactCard.title}</h1>
              <div className="flex gap-2 mb-4">
                {impactCard.category && (
                  <Badge variant="secondary" className="text-sm">
                    {impactCard.category}
                  </Badge>
                )}
                {impactCard.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {impactCard.location}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button onClick={handleSupport}>
                <HandHelping className="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <button
                    className="relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={selectedImage || ""}
                    alt="Project detail"
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <div className="prose max-w-none">
            <p className="text-lg">{impactCard.description}</p>
          </div>

          {impactCard.latitude && impactCard.longitude && (
            <div className="h-[400px] relative rounded-lg overflow-hidden">
              <MapContainer
                onMapLoad={(map) => {
                  if (impactCard.latitude && impactCard.longitude) {
                    new mapboxgl.Marker()
                      .setLngLat([impactCard.longitude, impactCard.latitude])
                      .addTo(map);
                  }
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t">
            <img
              src={impactCard.profiles?.avatar_url || "/placeholder.svg"}
              alt={impactCard.profiles?.username || "User"}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{impactCard.profiles?.username || "Anonymous"}</h3>
              <p className="text-sm text-muted-foreground">
                {impactCard.profiles?.professional_background || "No background provided"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex justify-between w-full">
            <span>Views: {impactCard.views}</span>
            <span>Shares: {impactCard.shares}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImpactCardDetail;