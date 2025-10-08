import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type EditorialCard = {
  title: string;
  excerpt: string;
  category: string;
  image?: string;
  publishedAt: string;
};

const editorials: EditorialCard[] = [
  {
    title: "Marbella Market, Reframed",
    excerpt: "Design-led developments are resetting expectations along the Golden Mile, creating a new paradigm for luxury coastal living.",
    category: "Market Insight",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    publishedAt: "October 2025",
  },
  {
    title: "Designing with Andalusian Light",
    excerpt: "Glazing, shading, and thermal comfort principles for coastal villas that embrace the Mediterranean climate.",
    category: "Design Journal",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    publishedAt: "September 2025",
  },
  {
    title: "Neighbourhood Guide · Golden Mile",
    excerpt: "Our curated shortlist of dining, wellness, and cultural highlights near Casa Serrana and our other developments.",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    publishedAt: "August 2025",
  },
  {
    title: "Inside the Atelier",
    excerpt: "Material stories and artisan collaborations from our Marbella workshop, where tradition meets innovation.",
    category: "Studio",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    publishedAt: "July 2025",
  },
  {
    title: "Sourcing Sustainable Stone",
    excerpt: "Tracing quarry provenance for each terrazzo slab and limestone block, ensuring ethical and aesthetic excellence.",
    category: "Process",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    publishedAt: "June 2025",
  },
  {
    title: "The Art of Editorial Living",
    excerpt: "How thoughtful curation and design create spaces that tell stories and inspire daily rituals.",
    category: "Philosophy",
    publishedAt: "May 2025",
  },
];

export const metadata: Metadata = {
  title: "Editorials",
  description: "Insights, guides, and stories from our practice in precision property development and refined living.",
};

export default function EditorialsPage() {
  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Editorial</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Stories & Insights
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            From market analysis to design philosophy, explore our perspective on luxury living 
            and architectural practice in Andalusia.
          </p>
        </div>
      </section>

      {/* Editorials Grid */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {editorials.map((editorial, index) => (
            <article
              key={editorial.title}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {editorial.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={editorial.image}
                    alt={editorial.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-red-600">
                    {editorial.category}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{editorial.publishedAt}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-light text-foreground">{editorial.title}</h3>
                  <p className="text-sm text-muted-foreground">{editorial.excerpt}</p>
                </div>
                <div className="mt-auto">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Read full article →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Subscribe to receive our latest editorials and project updates.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full border border-border bg-background px-6 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <button className="rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground/90">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
