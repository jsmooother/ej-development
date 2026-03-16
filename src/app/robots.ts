import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://www.ejdevelopment.es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/investor", "/admin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
