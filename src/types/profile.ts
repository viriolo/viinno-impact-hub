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
});

export type ProfileFormValues = z.infer<typeof profileSchema>;