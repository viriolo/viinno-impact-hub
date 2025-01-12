import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Image as ImageIcon } from "lucide-react";

const impactCardSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().optional(),
});

type ImpactCardFormValues = z.infer<typeof impactCardSchema>;

export default function CreateImpactCard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const form = useForm<ImpactCardFormValues>({
    resolver: zodResolver(impactCardSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("impact-card-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("impact-card-media").getPublicUrl(filePath);

      setMediaUrl(publicUrl);
      toast({
        title: "Media uploaded successfully",
        description: "Your image has been uploaded and will be included with your impact card.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your media. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ImpactCardFormValues) => {
    try {
      const { error } = await supabase.from("impact_cards").insert({
        user_id: user?.id,
        title: data.title,
        description: data.description,
        location: data.location,
        media_url: mediaUrl,
        status: "draft",
      });

      if (error) throw error;

      toast({
        title: "Impact card created",
        description: "Your impact card has been saved successfully.",
      });
      navigate("/impact-cards");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create impact card. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Impact Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title for your impact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe the impact you want to make"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Add a location"
                          {...field}
                          className="pl-10"
                        />
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Media</FormLabel>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isUploading}
                    onClick={() => document.getElementById("media-upload")?.click()}
                  >
                    <ImageIcon className="mr-2 h-5 w-5" />
                    {isUploading ? "Uploading..." : "Upload Media"}
                  </Button>
                  <input
                    id="media-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                </div>
                {mediaUrl && (
                  <div className="mt-2">
                    <img
                      src={mediaUrl}
                      alt="Uploaded media"
                      className="max-h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                Create Impact Card
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}