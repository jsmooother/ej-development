import Image from "next/image";
import type { Metadata } from "next";

const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=600&q=80",
    alt: "Coastal living at its finest",
    caption: "Morning light through the living room of Villa Ladera",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
    alt: "Mediterranean architecture details",
    caption: "Traditional Andalusian archways meet contemporary design",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80",
    alt: "Property showcase",
    caption: "Sierra Horizon's infinity pool with sea views",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
    alt: "Natural stone textures",
    caption: "Hand-selected limestone for the kitchen island",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
    alt: "Interior design details",
    caption: "Minimalist dining space in Mirador Alto",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1529429617124-aee81872894b?auto=format&fit=crop&w=600&q=80",
    alt: "Garden design",
    caption: "Native landscaping at Casa Palma",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=600&q=80",
    alt: "Architectural details",
    caption: "Custom joinery in the master suite",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    alt: "Workshop materials",
    caption: "Material selection process in our Marbella atelier",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
    alt: "Stone quarry visit",
    caption: "Sourcing sustainable materials from local quarries",
  },
];

export const metadata: Metadata = {
  title: "Instagram",
  description: "Behind-the-scenes glimpses of our precision-crafted projects, materials, and refined lifestyle.",
};

export default function InstagramPage() {
  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Social</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Instagram Feed
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Follow our journey through project development, material sourcing, and the daily rhythms 
            of life along the Costa del Sol.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://instagram.com/ejdevelopment"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition hover:border-primary"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @ejdevelopment
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instagramPosts.map((post) => (
            <article
              key={post.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Instagram icon overlay */}
                <div className="absolute top-4 right-4">
                  <div className="rounded-full bg-white/90 p-2 shadow-sm">
                    <svg className="h-5 w-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{post.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Follow CTA */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Join Our Community
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Follow us for daily inspiration and behind-the-scenes content.
          </p>
          <a
            href="https://instagram.com/ejdevelopment"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
