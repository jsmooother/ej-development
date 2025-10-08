import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://www.ejdevelopment.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
  ];
}
