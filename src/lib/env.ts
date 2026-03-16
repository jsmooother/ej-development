import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    INVESTOR_PASSWORD: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    SUPABASE_DB_POOL_URL: z.string().optional(),
    SUPABASE_DB_URL: z.string().optional(),
    DIRECT_URL: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    INSTAGRAM_APP_ID: z.string().optional(),
    INSTAGRAM_APP_SECRET: z.string().optional(),
    INSTAGRAM_REDIRECT_URI: z.string().optional(),
    MAPBOX_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .optional()
      .refine((v) => !v || v.startsWith("http"), "NEXT_PUBLIC_SUPABASE_URL must be a valid URL when set"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_INSTAGRAM_APP_ID: z.string().optional(),
    NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_INSTAGRAM_APP_ID: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
});
