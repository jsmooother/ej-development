import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

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
  type: "editorial";
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image?: string;
};

type InstagramCard = {
  type: "instagram";
  image: string;
  alt: string;
};

const projects: ProjectCard[] = [
  {
    id: "1",
    type: "project",
    title: "Sierra Horizon",
    slug: "sierra-horizon",
    summary: "Adaptive reuse opening a hillside estate toward the sea with layered courtyards.",
    location: "La Zagaleta · 2023",
    sqm: 420,
    rooms: 6,
    image: "/placeholder-project.jpg",
    isPublished: true,
    isHero: true,
  },
  {
    id: "2",
    type: "project",
    title: "Loma Azul",
    slug: "loma-azul",
    summary: "Minimalist cliffside retreat capturing Andalusian light from sunrise to dusk.",
    location: "Benahavís · 2022",
    sqm: 380,
    rooms: 5,
    image: "/placeholder-project.jpg",
    isPublished: true,
  },
  {
    id: "3",
    type: "project",
    title: "Casa Palma",
    slug: "casa-palma",
    summary: "Palm-framed sanctuary with shaded loggias and a terraced pool axis.",
    location: "Marbella Club · 2021",
    sqm: 320,
    rooms: 4,
    image: "/placeholder-project.jpg",
    isPublished: true,
  },
  {
    id: "4",
    type: "project",
    title: "Mirador Alto",
    slug: "mirador-alto",
    summary: "Art-filled penthouse reimagined with sculptural joinery and panoramic glazing.",
    location: "Puerto Banús · 2020",
    sqm: 280,
    rooms: 3,
    image: "/placeholder-project.jpg",
    isPublished: true,
  },
  {
    id: "5",
    type: "project",
    title: "Villa Ladera",
    slug: "villa-ladera",
    summary: "Split-level home cantilevered over native landscaping and a reflecting pool.",
    location: "Nueva Andalucía · 2019",
    sqm: 450,
    rooms: 7,
    image: "/placeholder-project.jpg",
    isPublished: true,
  },
  {
    id: "6",
    type: "project",
    title: "Casa Serrana",
    slug: "casa-serrana",
    summary: "Our flagship 700 sqm villa in Sierra Blanca is in final detailing. Photography, floorplans, and the full brochure will publish shortly.",
    location: "Sierra Blanca · 2024",
    sqm: 700,
    rooms: 8,
    image: "/placeholder-project.jpg",
    isPublished: true,
    isComingSoon: true,
    facts: {
      highlight1: "Double-height great room opening to an 18m infinity pool.",
      highlight2: "Primary suite with private solarium and Mediterranean views.",
      highlight3: "Wellness wing featuring spa, gym, and plunge court."
    }
  },
];

const editorials: EditorialCard[] = [
  {
    type: "editorial",
    title: "Marbella Market, Reframed",
    slug: "marbella-market-reframed",
    excerpt: "Design-led developments are resetting expectations along the Golden Mile.",
    category: "Market Insight",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
  },
  {
    type: "editorial",
    title: "Designing with Andalusian Light",
    slug: "designing-with-andalusian-light",
    excerpt: "Glazing, shading, and thermal comfort principles for coastal villas.",
    category: "Design Journal",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
  {
    type: "editorial",
    title: "Neighbourhood Guide · Golden Mile",
    slug: "neighbourhood-guide-golden-mile",
    excerpt: "Our shortlist of dining, wellness, and cultural highlights near Casa Serrana.",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
  },
  {
    type: "editorial",
    title: "Inside the Atelier",
    slug: "inside-the-atelier",
    excerpt: "Material stories and collaborations from our Marbella workshop.",
    category: "Studio",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
  },
  {
    type: "editorial",
    title: "Sourcing Sustainable Stone",
    slug: "sourcing-sustainable-stone",
    excerpt: "Tracing quarry provenance for each terrazzo slab and limestone block.",
    category: "Process",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
  },
];

const instagramCards: InstagramCard[] = [
  {
    type: "instagram",
    image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=600&q=80",
    alt: "Coastal living",
  },
  {
    type: "instagram",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
    alt: "Mediterranean architecture",
  },
  {
    type: "instagram",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80",
    alt: "Property showcase",
  },
];

const instagramTiles = [
  "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529429617124-aee81872894b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=600&q=80",
];

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxury property development in Marbella with a focus on modern Mediterranean architecture and curated living experiences.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0; // Revalidate every minute for faster updates

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
  // Content limits
  const maxProjects = 3;
  const maxEditorials = 10;
  const maxInstagram = 3;

  // Fetch live data from database
  let dbProjects: ProjectCard[] = [];
  let dbEditorials: EditorialCard[] = [];
  let dbInstagram: InstagramCard[] = [];

  try {
    // Use direct database access instead of internal API calls
    const { getDb } = await import('@/lib/db/index');
    const { projects: projectsSchema, posts, instagramCache } = await import('@/lib/db/schema');
    const { desc } = await import('drizzle-orm');
    
    const db = getDb();
    
    // Fetch projects, editorials, and Instagram posts directly from database
    const [rawProjects, rawEditorials, rawInstagram] = await Promise.all([
      db.select().from(projectsSchema).orderBy(desc(projectsSchema.createdAt)),
      db.select().from(posts).orderBy(desc(posts.createdAt)),
      db.select().from(instagramCache).orderBy(desc(instagramCache.fetchedAt))
    ]);

    console.log('✅ Fetched from DB:', {
      projects: rawProjects.length,
      editorials: rawEditorials.length,
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
    
    // Map Instagram posts
    dbInstagram = rawInstagram.map((post: any) => ({
      id: post.id,
      type: "instagram" as const,
      image: post.payload?.mediaUrl || '/placeholder-instagram.jpg',
      alt: post.payload?.caption || 'Instagram post'
    }));
    
  } catch (error) {
    console.error('❌ Error fetching live data:', error);
    dbProjects = projects;
    dbEditorials = editorials;
    dbInstagram = instagramCards;
  }

  // Use live data if available, otherwise fallback to static data
  const publishedProjects = dbProjects.length > 0 ? dbProjects : projects;
  const publishedEditorials = dbEditorials.length > 0 ? dbEditorials : editorials;
  // Only use static Instagram cards if no database data AND no error occurred
  const publishedInstagram = dbInstagram.length > 0 ? dbInstagram : [];

  // Find hero project and other projects
  const heroProject = publishedProjects.find(p => p.isHero) || publishedProjects[0];
  const otherProjects = publishedProjects.filter(p => p.id !== heroProject?.id);
  
  // Select content based on published status
  const selectedProjects = heroProject ? [heroProject, ...shuffleArray(otherProjects).slice(0, maxProjects - 1)] : shuffleArray(publishedProjects).slice(0, maxProjects);
  const selectedEditorials = publishedEditorials.slice(0, maxEditorials);
  const selectedInstagram = publishedInstagram.slice(0, maxInstagram);

  console.log('Published projects:', publishedProjects.length, 'Selected:', selectedProjects.length);
  console.log('Hero project:', heroProject?.title || 'None');
  console.log('Published editorials:', publishedEditorials.length, 'Selected:', selectedEditorials.length);

  // Create a newspaper-style mixed stream - filter out undefined items
  const featureStream = [
    selectedProjects[0], // Main hero project - full width, double height
    selectedEditorials[0], // Editorial - single column, double height
    selectedProjects[1], // Project - double width, single height
    selectedEditorials[1], // Editorial - single, standard
    selectedProjects[2], // Project - single, double height
    selectedEditorials[2], // Editorial - single, standard
  ].filter(Boolean); // Remove undefined items

  // Layout pattern with varied heights for newspaper aesthetic (like Lagerlings)
  const layoutPattern = [
    { className: "md:col-span-3 md:row-span-2", tall: true }, // Hero project: full width, double height
    { className: "md:col-span-1 md:row-span-2", tall: true }, // Editorial: single col, double height
    { className: "md:col-span-2" }, // Project: double width, single height
    { className: "md:col-span-1" }, // Editorial: single, standard
    { className: "md:col-span-1 md:row-span-2", tall: true }, // Project: single col, double height
    { className: "md:col-span-1" }, // Editorial: single, standard
  ];

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
                        {item.rooms} rum
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

            if (item.type === "editorial") {
              return (
                <Link
                  key={`${item.title}-${index}`}
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
