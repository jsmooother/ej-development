import { z } from "zod";

export const siteSettingsFormSchema = z.object({
  id: z.string().uuid().optional(),
  brandName: z.string().trim().min(1, "Brand name is required"),
  primaryInstagramUsername: z
    .string()
    .trim()
    .min(1, "Instagram username is required")
    .regex(/^[A-Za-z0-9._]+$/, "Only Instagram-compatible characters"),
  instagramAccessToken: z.string().optional(),
  contactEmail: z.union([z.literal(""), z.string().trim().email("Must be a valid email")]).optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  heroVideoUrl: z.union([z.literal(""), z.string().trim().url("Must be a valid URL")]).optional(),
  mapboxToken: z.string().optional(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
