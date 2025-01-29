import { SocialLinks } from "@/types/profile";

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

export const validateSocialLinks = (links: any): links is SocialLinks => {
  if (typeof links !== "object" || links === null) return false;
  
  const allowedKeys = ["twitter", "linkedin", "github"];
  const linkKeys = Object.keys(links);
  
  return linkKeys.every(key => 
    allowedKeys.includes(key) && 
    (typeof links[key] === "string" || links[key] === null)
  );
};

export const sanitizeProfileData = (data: any) => {
  const socialLinks = validateSocialLinks(data.social_links) 
    ? data.social_links 
    : {};
    
  return {
    ...data,
    social_links: socialLinks,
  };
};