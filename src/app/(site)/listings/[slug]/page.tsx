import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface ListingPageProps {
  params: {
    slug: string;
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const db = getDb();
  const listing = await db
    .select()
    .from(listings)
    .where(eq(listings.slug, params.slug))
    .limit(1)
    .then((results) => results[0]);

  if (!listing) {
    notFound();
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-4xl font-light">{listing.title}</h1>
          {listing.subtitle && (
            <p className="mt-2 text-lg text-muted-foreground">{listing.subtitle}</p>
          )}
        </div>

        <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
          Full listing page coming soon.
        </div>
      </div>
    </div>
  );
}
