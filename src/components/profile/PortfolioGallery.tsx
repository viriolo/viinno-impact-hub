
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Upload, X, MoreHorizontal, Eye, EyeOff, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PortfolioItem {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: string;
  created_at: string;
  updated_at: string;
  order_index: number;
  visibility: string;
}

interface PortfolioGalleryProps {
  userId: string;
  isCurrentUser?: boolean;
}

export function PortfolioGallery({ userId, isCurrentUser = false }: PortfolioGalleryProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    visibility: "public",
    file: null as File | null,
  });

  // Fetch portfolio items
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio-items", userId],
    queryFn: async () => {
      // If current user, get all items regardless of visibility
      // If not current user, only get public items
      let query = supabase
        .from("portfolio_items")
        .select("*")
        .eq("user_id", userId)
        .order("order_index", { ascending: true });
      
      if (!isCurrentUser) {
        query = query.eq("visibility", "public");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PortfolioItem[];
    },
  });

  // Mutation for uploading
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { title, description, visibility, file } = uploadForm;
      
      if (!file) throw new Error("No file selected");
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${visibility}/${Date.now()}.${fileExt}`;
      
      // Upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Insert portfolio item record
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          user_id: userId,
          title,
          description,
          media_url: filePath,
          media_type: file.type.split('/')[0], // 'image', 'video', etc.
          visibility,
          order_index: portfolioItems?.length || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      toast({ title: "Upload successful", description: "Your item has been added to your portfolio" });
      setUploadForm({ title: "", description: "", visibility: "public", file: null });
      setIsUploadDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["portfolio-items", userId] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast({ 
        title: "Upload failed", 
        description: "There was a problem uploading your item", 
        variant: "destructive" 
      });
    },
  });

  // Mutation for updating
  const updateMutation = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<PortfolioItem> }) => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(changes)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Update successful", description: "Your portfolio item has been updated" });
      setIsDetailsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["portfolio-items", userId] });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({ 
        title: "Update failed", 
        description: "There was a problem updating your item", 
        variant: "destructive" 
      });
    },
  });

  // Mutation for deleting
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get the item first to get the media_url
      const { data: item, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('media_url')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete the item from the database
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Delete the file from storage
      if (item?.media_url) {
        await supabase.storage
          .from('portfolio')
          .remove([item.media_url]);
      }
      
      return id;
    },
    onSuccess: () => {
      toast({ title: "Item deleted", description: "Your portfolio item has been removed" });
      setIsDetailsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["portfolio-items", userId] });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({ 
        title: "Delete failed", 
        description: "There was a problem deleting your item", 
        variant: "destructive" 
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPEG, PNG and GIF images are allowed",
          variant: "destructive"
        });
        return;
      }
      
      setUploadForm(prev => ({ ...prev, file: selectedFile }));
    }
  };

  const handleUpload = () => {
    if (!uploadForm.file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('visibility', uploadForm.visibility);
    
    uploadMutation.mutate(formData);
  };

  const handleVisibilityChange = (itemId: string, visibility: string) => {
    updateMutation.mutate({ id: itemId, changes: { visibility } });
  };

  const handleDelete = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      deleteMutation.mutate(itemId);
    }
  };

  const getMediaUrl = (item: PortfolioItem) => {
    return supabase.storage.from('portfolio').getPublicUrl(item.media_url).data.publicUrl;
  };

  // Render empty state if no items
  if (!isLoading && (!portfolioItems || portfolioItems.length === 0)) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Portfolio Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCurrentUser ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground text-center mb-4">
                Your portfolio is empty. Showcase your work by adding images.
              </p>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Portfolio Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add to Portfolio</DialogTitle>
                    <DialogDescription>
                      Upload an image to showcase in your portfolio. Max size 5MB.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Project Showcase"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your portfolio item..."
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select
                        value={uploadForm.visibility}
                        onValueChange={(value) => setUploadForm(prev => ({ ...prev, visibility: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="connections">Connections Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Image</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/70"
                        >
                          {uploadForm.file ? (
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex items-center">
                                <span className="font-medium text-sm truncate max-w-[200px]">
                                  {uploadForm.file.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setUploadForm(prev => ({ ...prev, file: null }));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(uploadForm.file.size / 1024)} KB
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF (max. 5MB)
                              </p>
                            </div>
                          )}
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!uploadForm.file || uploading}>
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              This user hasn't added any portfolio items yet.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Portfolio Gallery
        </CardTitle>
        {isCurrentUser && (
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {/* Upload dialog content - same as above */}
              <DialogHeader>
                <DialogTitle>Add to Portfolio</DialogTitle>
                <DialogDescription>
                  Upload an image to showcase in your portfolio. Max size 5MB.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Project Showcase"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your portfolio item..."
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={uploadForm.visibility}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, visibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Image</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/70"
                    >
                      {uploadForm.file ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center">
                            <span className="font-medium text-sm truncate max-w-[200px]">
                              {uploadForm.file.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setUploadForm(prev => ({ ...prev, file: null }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(uploadForm.file.size / 1024)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF (max. 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!uploadForm.file || uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioItems?.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-md overflow-hidden">
                <img
                  src={getMediaUrl(item)}
                  alt={item.title || "Portfolio item"}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-medium truncate">
                      {item.title || "Untitled"}
                    </h3>
                    
                    {isCurrentUser && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(item);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleVisibilityChange(item.id, "public")}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Make Public
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleVisibilityChange(item.id, "connections")}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Connections Only
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleVisibilityChange(item.id, "private")}
                            className="flex items-center"
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            Make Private
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive flex items-center"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  <div>
                    {item.visibility !== "public" && (
                      <Badge variant="secondary" className="mb-2">
                        {item.visibility === "private" ? "Private" : "Connections Only"}
                      </Badge>
                    )}
                    <p className="text-white/80 text-sm line-clamp-3">
                      {item.description || "No description"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Item details dialog */}
        {selectedItem && (
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Portfolio Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedItem.title || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedItem.description || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-visibility">Visibility</Label>
                  <Select
                    value={selectedItem.visibility}
                    onValueChange={(value) => setSelectedItem({ ...selectedItem, visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedItem.id,
                      changes: {
                        title: selectedItem.title,
                        description: selectedItem.description,
                        visibility: selectedItem.visibility,
                      },
                    })
                  }
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
