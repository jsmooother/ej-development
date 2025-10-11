import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type ListingCard = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  location: {
    address?: string;
    locality?: string;
    country?: string;
  } | null;
  status: string;
  facts: {
    bedrooms?: number;
    bathrooms?: number;
    builtAreaSqm?: number;
    plotSqm?: number;
  } | null;
  heroImagePath: string | null;
  isPublished: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Property Listings",
  description: "Explore our curated selection of luxury properties for sale across the Costa del Sol.",
};

export default async function ListingsPage() {
  // Fetch listings from database
  let listings: ListingCard[] = [];
  
  try {
    // Use direct database access instead of internal API call
    const { getDb } = await import('@/lib/db/index');
    const { listings: listingsSchema } = await import('@/lib/db/schema');
    const { desc } = await import('drizzle-orm');
    
    const db = getDb();
    const dbListings = await db.select().from(listingsSchema).orderBy(desc(listingsSchema.createdAt));
    
    console.log('📊 Database returned listings:', dbListings.length);
    
    // Filter only published listings
    listings = dbListings
      .filter((listing: any) => {
        console.log(`Listing ${listing.title}: isPublished=${listing.isPublished}`);
        return listing.isPublished;
      })
      .map((listing: any) => ({
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        subtitle: listing.subtitle,
        location: listing.location,
        status: listing.status,
        facts: listing.facts || {},
        heroImagePath: listing.heroImagePath || '/placeholder-project.jpg',
        isPublished: listing.isPublished
      }));
    
    console.log('📊 After filtering:', listings.length, 'published listings');
  } catch (error) {
    console.error('Error fetching listings:', error);
    listings = [];
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'for_sale':
        return 'For Sale';
      case 'sold':
        return 'Sold';
      case 'coming_soon':
        return 'Coming Soon';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'for_sale':
        return 'bg-green-500/90';
      case 'sold':
        return 'bg-gray-500/90';
      case 'coming_soon':
        return 'bg-blue-500/90';
      default:
        return 'bg-gray-500/90';
    }
  };

  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Available Properties</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Exclusive Listings
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Discover exceptional properties in prime locations across the Costa del Sol, 
            each offering refined living spaces and thoughtful design.
          </p>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="mx-auto max-w-6xl px-6">
        {listings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M3 7V4a1 1 0 011-1h16a1 1 0 011 1v3M4 21v-8M20 21v-8M8 10v4M16 10v4" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No listings available</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Check back soon for new luxury property listings.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={listing.heroImagePath || '/placeholder-project.jpg'}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`rounded-full ${getStatusColor(listing.status)} px-3 py-1 text-sm font-semibold text-white shadow-sm`}>
                      {getStatusLabel(listing.status)}
                    </span>
                  </div>
                  {/* Area overlay */}
                  {listing.facts?.builtAreaSqm && (
                    <div className="absolute bottom-4 right-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                        {listing.facts.builtAreaSqm} m²
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-light text-foreground">{listing.title}</h3>
                    {listing.subtitle && (
                      <p className="text-sm text-muted-foreground">{listing.subtitle}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {listing.facts?.bedrooms && <span>{listing.facts.bedrooms} beds</span>}
                      {listing.facts?.bathrooms && <span>{listing.facts.bathrooms} baths</span>}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                    <span>{listing.location?.locality || 'Marbella'}</span>
                    <span>View details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-6 text-center">
        <div className="rounded-3xl border border-border bg-card p-12">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Looking for something specific?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Let us help you find your perfect property on the Costa del Sol.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}

