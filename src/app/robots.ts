import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://www.ejdevelopment.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
