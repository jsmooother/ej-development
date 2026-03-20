import type { Metadata } from "next";
import type { ReactNode } from "react";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db/index";
import { projects } from "@/lib/db/schema";
import { buildOgImageUrl } from "@/lib/og";

type LayoutProps = {
  children: ReactNode;
  params: { slug: string };
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const fallbackTitle = "EJ Development - Project";
  const fallbackDescription =
    "Design-led luxury real estate project in Marbella's most exclusive communities.";
  const pageUrl = `https://www.ejproperties.es/projects/${params.slug}`;

  try {
    const db = getDb();
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.slug, params.slug), eq(projects.isPublished, true)),
    });

    if (!project) {
      return {
        title: fallbackTitle,
        description: fallbackDescription,
      };
    }

    const area = project.facts?.sqm ? `${project.facts.sqm} sqm` : "Luxury residence";
    const imageUrl = buildOgImageUrl({
      title: project.title,
      subtitle: `Marbella · ${area}`,
      highlight: "Design-led architecture · Exclusive location",
      image: project.heroImagePath ?? undefined,
      badge: "Project",
    });

    return {
      title: `${project.title} | EJ Properties`,
      description: project.summary || fallbackDescription,
      alternates: { canonical: `/projects/${params.slug}` },
      openGraph: {
        title: project.title,
        description: project.summary || fallbackDescription,
        url: pageUrl,
        type: "website",
        siteName: "EJ Development",
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.summary || fallbackDescription,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }
}

export default function ProjectSlugLayout({ children }: LayoutProps) {
  return children;
}
