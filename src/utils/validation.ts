import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
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

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
