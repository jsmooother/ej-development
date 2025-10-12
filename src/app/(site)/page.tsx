import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ContentLimits, isContentLimits } from "@/lib/types/settings";

type ProjectCard = {
  id: string;
  type: "project";
  title: string;
  slug: string;
  summary: string;
  location: string;
  image: string;
  sqm: number;
  rooms: number;
  isHero?: boolean;
  isComingSoon?: boolean;
  isPublished?: boolean;
  facts?: Record<string, string>;
};

type EditorialCard = {
  id: string;
  type: "editorial";
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image?: string;
};

type ListingCard = {
  id: string;
  type: "listing";
  title: string;
  slug: string;
  subtitle: string;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  builtAreaSqm: number;
  status: string;
  isPublished?: boolean;
};

type InstagramCard = {
  type: "instagram";
  image: string;
  alt: string;
};

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxury property development in Marbella with a focus on modern Mediterranean architecture and curated living experiences.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Helper function to shuffle array (for randomizing projects)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function HomePage() {
  // Default content limits
  let contentLimits: ContentLimits = {
    frontpage: {
      projects: 3,
      editorials: 10,
      instagram: 3,
      listings: 3
    }
  };

  // Fetch live data from database
  let dbProjects: ProjectCard[] = [];
  let dbEditorials: EditorialCard[] = [];
  let dbListings: ListingCard[] = [];
  let dbInstagram: InstagramCard[] = [];

  try {
    // Use direct database access instead of internal API calls
    const { getDb } = await import('@/lib/db/index');
    const { projects: projectsSchema, posts, listings: listingsSchema, instagramCache, siteSettings } = await import('@/lib/db/schema');
    const { desc, eq } = await import('drizzle-orm');
    
    const db = getDb();

    // Fetch content limits
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.keyName, "content_limits")
    });

    if (settings && isContentLimits(settings.value)) {
      contentLimits = settings.value;
    }
    
    // Fetch projects, editorials, listings, and Instagram posts directly from database
    const [rawProjects, rawEditorials, rawListings, rawInstagram] = await Promise.all([
      db.select().from(projectsSchema).orderBy(desc(projectsSchema.createdAt)),
      db.select().from(posts).orderBy(desc(posts.createdAt)),
      db.select().from(listingsSchema).orderBy(desc(listingsSchema.createdAt)),
      db.select().from(instagramCache).orderBy(desc(instagramCache.fetchedAt))
    ]);

    console.log('✅ Fetched from DB:', {
      projects: rawProjects.length,
      editorials: rawEditorials.length,
      listings: rawListings.length,
      instagram: rawInstagram.length
    });
    
    // Map and filter published projects
    dbProjects = rawProjects
      .filter((project: any) => project.isPublished)
      .map((project: any) => ({
        id: project.id,
        type: "project" as const,
        slug: project.slug || `project-${project.id}`,
        title: project.title,
        summary: project.summary,
        location: project.location || 'Andalusia',
        sqm: project.facts?.sqm || 0,
        rooms: project.facts?.bedrooms || 0,
        image: project.heroImagePath || '/placeholder-project.jpg',
        isHero: project.isHero || false,
        isComingSoon: project.isComingSoon || false,
        isPublished: project.isPublished
      }));
    
    // Map and filter published editorials
    dbEditorials = rawEditorials
      .filter((editorial: any) => editorial.isPublished)
      .map((editorial: any) => ({
        id: editorial.id,
        type: "editorial" as const,
        slug: editorial.slug || `editorial-${editorial.id}`,
        title: editorial.title,
        excerpt: editorial.excerpt || '',
        category: editorial.category || 'Editorial',
        image: editorial.coverImagePath || '/placeholder-editorial.jpg'
      }));
    
    // Map and filter published listings
    dbListings = rawListings
      .filter((listing: any) => listing.isPublished)
      .map((listing: any) => ({
        id: listing.id,
        type: "listing" as const,
        slug: listing.slug || `listing-${listing.id}`,
        title: listing.title,
        subtitle: listing.subtitle || '',
        location: listing.location?.address || listing.location?.locality || 'Marbella',
        image: listing.heroImagePath || '/placeholder-project.jpg',
        bedrooms: listing.facts?.bedrooms || 0,
        bathrooms: listing.facts?.bathrooms || 0,
        builtAreaSqm: listing.facts?.builtAreaSqm || 0,
        status: listing.status || 'for_sale',
        isPublished: listing.isPublished
      }));
    
    // Map Instagram posts
    dbInstagram = rawInstagram.map((post: any) => ({
      id: post.id,
      type: "instagram" as const,
      image: post.payload?.mediaUrl || '/placeholder-instagram.jpg',
      alt: post.payload?.caption || 'Instagram post'
    }));
    
  } catch (error) {
    console.error('❌ Error fetching live data:', error);
  }

  // Use live data if available
  const publishedProjects = dbProjects.length > 0 ? dbProjects : [];
  const publishedEditorials = dbEditorials.length > 0 ? dbEditorials : [];
  const publishedListings = dbListings.length > 0 ? dbListings : [];
  const publishedInstagram = dbInstagram.length > 0 ? dbInstagram : [];

  // Find hero project and other projects
  const heroProject = publishedProjects.find(p => p.isHero) || publishedProjects[0];
  const otherProjects = publishedProjects.filter(p => p.id !== heroProject?.id);
  
  // Select content based on published status
  const selectedProjects = heroProject 
    ? [heroProject, ...shuffleArray(otherProjects).slice(0, contentLimits.frontpage.projects - 1)] 
    : shuffleArray(publishedProjects).slice(0, contentLimits.frontpage.projects);
  const selectedEditorials = publishedEditorials.slice(0, contentLimits.frontpage.editorials);
  const selectedListings = publishedListings.slice(0, contentLimits.frontpage.listings || 3);
  const selectedInstagram = publishedInstagram.slice(0, contentLimits.frontpage.instagram);

  console.log('Published projects:', publishedProjects.length, 'Selected:', selectedProjects.length);
  console.log('Hero project:', heroProject?.title || 'None');
  console.log('Published editorials:', publishedEditorials.length, 'Selected:', selectedEditorials.length);
  console.log('Content limits:', contentLimits);

  // Create a dynamic mixed stream based on content limits
  const featureStream: (ProjectCard | EditorialCard | ListingCard)[] = [];
  let projectIndex = 0;
  let editorialIndex = 0;
  let listingIndex = 0;
  
  // Start with hero project if available
  if (selectedProjects[projectIndex]) {
    featureStream.push(selectedProjects[projectIndex]);
    projectIndex++;
  }
  
  // Alternate between editorials, listings, and projects to fill the stream
  const totalItems = selectedProjects.length + selectedEditorials.length + selectedListings.length;
  for (let i = featureStream.length; i < totalItems; i++) {
    // Prioritize editorials if we have them and haven't reached the limit
    if (editorialIndex < selectedEditorials.length) {
      featureStream.push(selectedEditorials[editorialIndex]);
      editorialIndex++;
    }
    // Then add listings
    if (listingIndex < selectedListings.length) {
      featureStream.push(selectedListings[listingIndex]);
      listingIndex++;
    }
    // Then add projects
    if (projectIndex < selectedProjects.length) {
      featureStream.push(selectedProjects[projectIndex]);
      projectIndex++;
    }
  }

  // Dynamic layout pattern generator - ensures rows are filled before creating new ones
  // Strategy: Use a row-based approach where we track column usage per row
  const layoutPattern: { className: string; tall?: boolean }[] = [];
  let currentRow = 0;
  let columnsUsed = 0; // Track columns used in current row (out of 3 total)
  
  featureStream.forEach((_, index) => {
    // First item is always the hero (3 columns, 2 rows)
    if (index === 0) {
      layoutPattern.push({ className: "md:col-span-3 md:row-span-2", tall: true });
      currentRow += 2; // Hero takes 2 rows
      columnsUsed = 0; // Reset for next row
      return;
    }
    
    // For remaining items, fill rows systematically
    // Check available space in current row (3 columns total)
    const remainingColumns = 3 - columnsUsed;
    
    // If we have a full row available (3 columns), alternate patterns for variety
    if (remainingColumns === 3) {
      // Pattern: 1 tall (1 col, 2 rows) + 2 standard (1 col each)
      if (index % 6 === 1 || index % 6 === 4) {
        layoutPattern.push({ className: "md:col-span-1 md:row-span-2", tall: true });
        columnsUsed = 1;
      } else {
        layoutPattern.push({ className: "md:col-span-1" });
        columnsUsed = 1;
      }
    } else if (remainingColumns === 2) {
      // Fill with 2-column or 2x 1-column items
      if (index % 3 === 0) {
        layoutPattern.push({ className: "md:col-span-2" });
        columnsUsed = 3; // Row complete
      } else {
        layoutPattern.push({ className: "md:col-span-1" });
        columnsUsed += 1;
      }
    } else if (remainingColumns === 1) {
      // Only 1 column left, fill it
      layoutPattern.push({ className: "md:col-span-1" });
      columnsUsed = 0; // Row complete, reset
      currentRow += 1;
    }
    
    // If row is complete (3 columns used), move to next row
    if (columnsUsed >= 3) {
      columnsUsed = 0;
      currentRow += 1;
    }
  });

  return (
    <main id="top" className="space-y-24 pb-24">
      {/* Hero Intro */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-24 pt-28 text-center md:pt-32">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">EJ Properties</p>
          <h1 className="font-serif text-4xl font-light leading-tight text-foreground md:text-6xl">
            Precision in every square meter.
          </h1>
          <div className="max-w-4xl space-y-6 text-base text-muted-foreground md:text-lg">
            <p>
              We create homes where every square meter is optimized with precision. Through smart layouts and a natural flow between rooms, we design spaces that feel effortless, harmonious, and perfectly balanced.
            </p>
            <p>
              Our strength lies in tailoring every detail – from intelligent storage solutions to seamless integrations – ensuring that function and elegance go hand in hand.
            </p>
            <p>
              With a foundation of timeless design, refined by a modern touch, we work with warm tones and natural materials to bring a sense of sophistication and comfort. The result is homes that radiate understated luxury while remaining inviting, personal, and truly livable.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]">
            <Link href="#portfolio" scroll className="rounded-full border border-border px-6 py-3 hover:border-primary">
              Explore Portfolio
            </Link>
            <Link
              href="#contact"
              scroll
              className="rounded-full border border-transparent bg-foreground px-6 py-3 text-background"
            >
              Speak with us
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Flagship */}
      {publishedProjects.find(p => p.isComingSoon) && (
        <section id="upcoming" className="mx-auto max-w-6xl rounded-3xl border border-border bg-card px-6 py-16 md:px-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Next Release</p>
              <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">{publishedProjects.find(p => p.isComingSoon)?.title}</h2>
              <p className="text-sm text-muted-foreground">
                {publishedProjects.find(p => p.isComingSoon)?.summary}
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Brochure Highlights To Come</p>
              <ul className="space-y-2">
                {Object.entries(publishedProjects.find(p => p.isComingSoon)?.facts || {}).map(([key, value], index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Feature Stream */}
      <section id="portfolio" className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Portfolio & Editorial</p>
            <h2 className="mt-2 font-serif text-4xl font-light text-foreground md:text-5xl">
              Projects in dialogue with stories
            </h2>
          </div>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(240px,auto)] gap-6 md:grid-cols-3">
          {featureStream.map((item, index) => {
            const layout = layoutPattern[index % layoutPattern.length];

            if (item.type === "project") {
              return (
                <Link
                  key={`${item.title}-${index}`}
                  href={`/projects/${item.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                    layout.className,
                    layout.tall && "md:row-span-2",
                  )}
                >
                  <div className="relative h-56 w-full md:h-64">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* SQM and Rooms overlay like lagerlings.se */}
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                        {item.sqm} m²
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                        {item.rooms} Bedrooms
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-light text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                      <span>{item.location}</span>
                      <span>View project →</span>
                    </div>
                  </div>
                </Link>
              );
            }

            if (item.type === "listing") {
              return (
                <Link
                  key={`${item.title}-${index}`}
                  href={`/listings/${item.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                    layout.className,
                    layout.tall && "md:row-span-2",
                  )}
                >
                  <div className="relative h-56 w-full md:h-64">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-green-500/90 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                        {item.status === 'for_sale' ? 'For Sale' : item.status === 'sold' ? 'Sold' : 'Coming Soon'}
                      </span>
                    </div>
                    {/* Area overlay */}
                    <div className="absolute bottom-4 right-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                        {item.builtAreaSqm} m²
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-light text-foreground">{item.title}</h3>
                      {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {item.bedrooms > 0 && <span>{item.bedrooms} beds</span>}
                        {item.bathrooms > 0 && <span>{item.bathrooms} baths</span>}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                      <span>{item.location}</span>
                      <span>View listing →</span>
                    </div>
                  </div>
                </Link>
              );
            }

            if (item.type === "editorial") {
              return (
                <Link
                  key={item.id}
                  href={`/editorials/${item.slug}`}
                  className={cn(
                    "flex h-full flex-col justify-between rounded-3xl border border-border bg-background/80 p-6 transition hover:border-primary",
                    layout.className,
                    layout.tall && "md:row-span-2",
                  )}
                >
                  <div className="space-y-4">
                    {/* Editorial header like "PROFILER" */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.4em] text-red-600">Editorial</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl font-light text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                    </div>
                    {item.image && (
                      <div className="relative h-32 w-full overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Read full editorial →</span>
                </Link>
              );
            }

            return null;
          })}
        </div>
      </section>

      {/* Studio */}
      <section id="studio" className="mx-auto max-w-4xl px-6">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Studio</p>
        <h2 className="mt-3 font-serif text-4xl font-light text-foreground md:text-5xl">
          Philosophy & Craft
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            EJ Development choreographs sites, layouts, and material palettes with a calm confidence. We balance
            editorial minimalism with Andalusian warmth, working shoulder-to-shoulder with artisans from initial
            sketches through final styling.
          </p>
          <p>
            Every project is bespoke. We prototype joinery, test lighting compositions, and choreograph flows to
            suit the specific rhythms of our clients.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="mx-auto grid max-w-5xl gap-10 rounded-3xl border border-border bg-card px-6 py-14 md:grid-cols-[2fr,1fr]"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Enquiries</p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
            Let&apos;s design what&apos;s next for the Costa del Sol.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Our unified enquiry form is in development. For now, reach us directly and we&apos;ll share tailored
            documentation, floorplans, and schedules.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em]">
            <Link href="mailto:hello@ejproperties.com" className="rounded-full border border-border px-5 py-2 hover:border-primary">
              hello@ejproperties.com
            </Link>
            <Link href="tel:+34600123456" className="rounded-full border border-border px-5 py-2 hover:border-primary">
              +34 600 123 456
            </Link>
          </div>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Studio</p>
            <p className="mt-2 text-foreground">Marbella · Costa del Sol</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Press & Partnerships</p>
            <p className="mt-2">press@ejproperties.com</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Office Hours</p>
            <p className="mt-2">Monday – Friday, 09:00–18:00 CET</p>
          </div>
        </div>
      </section>
    </main>
  );
}