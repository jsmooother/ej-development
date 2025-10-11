import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Listing = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: string;
  location: {
    address?: string;
    locality?: string;
    country?: string;
  } | null;
  facts: {
    bedrooms?: number;
    bathrooms?: number;
    builtAreaSqm?: number;
    plotSqm?: number;
    parkingSpaces?: number;
    orientation?: string;
    amenities?: string[];
  } | null;
  heroImagePath: string | null;
  isPublished: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = await getListing(params.slug);
  
  if (!listing) {
    return {
      title: "Listing Not Found",
    };
  }

  return {
    title: `${listing.title} | Property Listings`,
    description: listing.subtitle || listing.description || `Luxury property listing in ${listing.location?.locality || 'Costa del Sol'}`,
  };
}

async function getListing(slug: string): Promise<Listing | null> {
  try {
    // Use direct database access
    const { getDb } = await import('@/lib/db/index');
    const { listings } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    
    const db = getDb();
    const results = await db.select().from(listings).where(eq(listings.slug, slug));
    
    if (results.length === 0 || !results[0].isPublished) {
      return null;
    }

    return results[0] as Listing;
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = await getListing(params.slug);

  if (!listing) {
    notFound();
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

  // Mock gallery images - in production, these would come from listing_images table
  const galleryImages = [
    listing.heroImagePath || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
  ];

  return (
    <main className="min-h-screen bg-[#f5f2ea]">
      {/* Minimalist Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/listings" className="text-xs font-medium uppercase tracking-[0.3em] text-gray-600 transition hover:text-black">
              ← All Listings
            </Link>
            <Link href="/" className="font-serif text-lg tracking-wider text-black">
              EJ PROPERTIES
            </Link>
            <button className="text-xs font-medium uppercase tracking-[0.3em] text-gray-600 transition hover:text-black">
              Share
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src={listing.heroImagePath || galleryImages[0]}
            alt={listing.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-16 text-white">
            <div className="max-w-3xl space-y-6">
              <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em]">
                {getStatusLabel(listing.status)}
              </div>
              <h1 className="font-serif text-5xl font-light leading-tight md:text-7xl">
                {listing.title}
              </h1>
              {listing.subtitle && (
                <p className="text-lg leading-relaxed text-white/90 md:text-xl">
                  {listing.subtitle}
                </p>
              )}
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm">
                {listing.facts?.builtAreaSqm && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>{listing.facts.builtAreaSqm} m²</span>
                  </div>
                )}
                {listing.facts?.bedrooms && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{listing.facts.bedrooms} Bedrooms</span>
                  </div>
                )}
                {listing.facts?.bathrooms && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    <span>{listing.facts.bathrooms} Bathrooms</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Overview - Luxury Magazine Style */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[2fr,1fr]">
          {/* Main Content */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-foreground">
                About This Property
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700">
                  {listing.description || listing.subtitle || `Discover this exceptional property in ${listing.location?.locality || 'the Costa del Sol'}.`}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {listing.facts?.amenities && listing.facts.amenities.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-light text-foreground">
                  Amenities & Features
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {listing.facts.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Property Details */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                Property Details
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-black">{getStatusLabel(listing.status)}</span>
                </div>
                {listing.facts?.builtAreaSqm && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Built Area</span>
                    <span className="font-medium text-black">{listing.facts.builtAreaSqm} m²</span>
                  </div>
                )}
                {listing.facts?.plotSqm && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Plot Size</span>
                    <span className="font-medium text-black">{listing.facts.plotSqm} m²</span>
                  </div>
                )}
                {listing.facts?.bedrooms && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium text-black">{listing.facts.bedrooms}</span>
                  </div>
                )}
                {listing.facts?.bathrooms && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium text-black">{listing.facts.bathrooms}</span>
                  </div>
                )}
                {listing.facts?.parkingSpaces && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-medium text-black">{listing.facts.parkingSpaces} spaces</span>
                  </div>
                )}
                {listing.facts?.orientation && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Orientation</span>
                    <span className="font-medium text-black">{listing.facts.orientation}</span>
                  </div>
                )}
                {listing.location && (
                  <div className="flex justify-between pb-3">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium text-black">
                      {[listing.location.locality, listing.location.country].filter(Boolean).join(', ') || 'Costa del Sol'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="rounded-2xl bg-foreground p-8 text-white">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em]">
                Interested?
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-white/90">
                Request detailed property information, schedule a viewing, or discuss this opportunity.
              </p>
              <a
                href="mailto:hello@ejproperties.com"
                className="inline-block w-full rounded-lg bg-white px-6 py-3 text-center text-sm font-medium text-black transition hover:bg-white/90"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Property Gallery */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-light text-black md:text-5xl">
              Gallery
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gray-500">
              Interior · Exterior · Views
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                className="group relative h-[400px] overflow-hidden rounded-lg transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => {
                  // Open image in new tab for now
                  window.open(image, '_blank');
                }}
                aria-label={`View full size image ${index + 1} of ${listing.title}`}
              >
                <Image
                  src={image}
                  alt={`${listing.title} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-white/90 p-3 shadow-lg">
                      <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      {listing.location?.locality && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-4xl font-light text-foreground">
                Location
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {[listing.location.locality, listing.location.country].filter(Boolean).join(', ')}
              </p>
            </div>
            
            {/* Location placeholder - in production, embed Google Maps */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="flex h-[400px] items-center justify-center bg-gray-100">
                <div>
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mt-4 text-sm text-gray-500">Map will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-foreground py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            Schedule a Viewing
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/90">
            Experience this property in person. Contact us to arrange a private viewing at your convenience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@ejproperties.com"
              className="rounded-full border border-white bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Email Us
            </a>
            <a
              href="tel:+34600123456"
              className="rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Call +34 600 123 456
            </a>
          </div>
        </div>
      </section>

      {/* More Listings */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-light text-foreground">
            More Properties
          </h2>
          <Link
            href="/listings"
            className="mt-6 inline-block text-sm uppercase tracking-[0.3em] text-muted-foreground transition hover:text-foreground"
          >
            View All Listings →
          </Link>
        </div>
      </section>
    </main>
  );
}
