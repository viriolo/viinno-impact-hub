import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sanitizeFileName } from "@/utils/security";

export interface ProfileAvatarProps {
  avatarUrl?: string | null;
  username?: string;
  email?: string;
  onAvatarChange: (file: File) => void;
  isLoading?: boolean;
}

export const ProfileAvatar = ({
  avatarUrl,
  username,
  email,
  onAvatarChange,
  isLoading = false,
}: ProfileAvatarProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsValidating(true);
      
      // Validate file type (whitelist approach)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        setIsValidating(false);
        resolve(false);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        setIsValidating(false);
        resolve(false);
        return;
      }

      // Validate image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDimension = 4096; // Prevent unreasonably large images
        if (img.width > maxDimension || img.height > maxDimension) {
          toast.error(`Image dimensions should not exceed ${maxDimension}x${maxDimension} pixels`);
          setIsValidating(false);
          resolve(false);
          return;
        }
        if (img.width < 100 || img.height < 100) {
          toast.error('Image dimensions should be at least 100x100 pixels');
          setIsValidating(false);
          resolve(false);
          return;
        }
        setIsValidating(false);
        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        toast.error('Invalid or corrupted image file');
        setIsValidating(false);
        resolve(false);
      };

      img.src = objectUrl;
    });
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Sanitize filename
    const sanitizedFile = new File([file], sanitizeFileName(file.name), {
      type: file.type,
      lastModified: file.lastModified,
    });

    const isValid = await validateFile(sanitizedFile);
    if (!isValid) return;

    onAvatarChange(sanitizedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(sanitizedFile);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarPreview || avatarUrl || ""} alt="Profile" />
          <AvatarFallback className="bg-primary/10">
            {username?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Label
          htmlFor="avatar-upload"
          className={`absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-sm transition-colors ${
            isLoading || isValidating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
        >
          {isLoading || isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Label>
      </div>
      <Input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleAvatarChange}
        className="hidden"
        id="avatar-upload"
        disabled={isLoading || isValidating}
      />
      <Label
        htmlFor="avatar-upload"
        className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${
          isLoading || isValidating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading || isValidating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Uploading...' : isValidating ? 'Validating...' : 'Upload Avatar'}
      </Label>
    </div>
  );
};