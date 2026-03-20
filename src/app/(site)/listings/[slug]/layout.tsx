import type { Metadata } from "next";
import type { ReactNode } from "react";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/index";
import { listings } from "@/lib/db/schema";
import { buildOgImageUrl } from "@/lib/og";

type LayoutProps = {
  children: ReactNode;
  params: { slug: string };
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const fallbackTitle = "EJ Development - Property Listing";
  const fallbackDescription =
    "Exclusive Marbella real estate listing with premium architecture and refined design.";
  const pageUrl = `https://www.ejproperties.es/listings/${params.slug}`;

  try {
    const db = getDb();
    const listing = await db.query.listings.findFirst({
      where: and(eq(listings.slug, params.slug), eq(listings.isPublished, true)),
    });

    if (!listing) {
      return {
        title: fallbackTitle,
        description: fallbackDescription,
      };
    }

    const area = listing.facts?.builtAreaSqm
      ? `${listing.facts.builtAreaSqm} sqm`
      : "Luxury property";
    const locality = listing.location?.locality || "Marbella";
    const imageUrl = buildOgImageUrl({
      title: listing.title,
      subtitle: `${locality} · ${area}`,
      highlight: "Exclusive listing · Premium architecture",
      image: listing.heroImagePath ?? undefined,
      badge: "Exclusive",
    });

    return {
      title: `${listing.title} | EJ Properties`,
      description: listing.subtitle || fallbackDescription,
      alternates: { canonical: `/listings/${params.slug}` },
      openGraph: {
        title: listing.title,
        description: listing.subtitle || fallbackDescription,
        url: pageUrl,
        type: "website",
        siteName: "EJ Development",
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: listing.title,
        description: listing.subtitle || fallbackDescription,
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

export default function ListingSlugLayout({ children }: LayoutProps) {
  return children;
}
