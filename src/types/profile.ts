import { z } from "zod";

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  social_links: z.object({
    twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  }),
  academic_background: z.string().optional(),
  professional_background: z.string().optional(),
  expertise_areas: z.array(z.string()).optional(),
  organization_name: z.string().optional(),
  organization_type: z.string().optional(),
  organization_description: z.string().optional(),
  availability: z.record(z.any()).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;