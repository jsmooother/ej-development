import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

type ProjectCard = {
  type: "project";
  title: string;
  summary: string;
  location: string;
  image: string;
};

type EditorialCard = {
  type: "editorial";
  title: string;
  excerpt: string;
  category: string;
};

const projects: ProjectCard[] = [
  {
    type: "project",
    title: "Sierra Horizon",
    summary: "Adaptive reuse opening a hillside estate toward the sea with layered courtyards.",
    location: "La Zagaleta · 2023",
    image: "https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    type: "project",
    title: "Loma Azul",
    summary: "Minimalist cliffside retreat capturing Andalusian light from sunrise to dusk.",
    location: "Benahavís · 2022",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  },
  {
    type: "project",
    title: "Casa Palma",
    summary: "Palm-framed sanctuary with shaded loggias and a terraced pool axis.",
    location: "Marbella Club · 2021",
    image: "https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    type: "project",
    title: "Mirador Alto",
    summary: "Art-filled penthouse reimagined with sculptural joinery and panoramic glazing.",
    location: "Puerto Banús · 2020",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    type: "project",
    title: "Villa Ladera",
    summary: "Split-level home cantilevered over native landscaping and a reflecting pool.",
    location: "Nueva Andalucía · 2019",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80",
  },
];

const editorials: EditorialCard[] = [
  {
    type: "editorial",
    title: "Marbella Market, Reframed",
    excerpt: "Design-led developments are resetting expectations along the Golden Mile.",
    category: "Market Insight",
  },
  {
    type: "editorial",
    title: "Designing with Andalusian Light",
    excerpt: "Glazing, shading, and thermal comfort principles for coastal villas.",
    category: "Design Journal",
  },
  {
    type: "editorial",
    title: "Neighbourhood Guide · Golden Mile",
    excerpt: "Our shortlist of dining, wellness, and cultural highlights near Casa Serrana.",
    category: "Guide",
  },
  {
    type: "editorial",
    title: "Inside the Atelier",
    excerpt: "Material stories and collaborations from our Marbella workshop.",
    category: "Studio",
  },
  {
    type: "editorial",
    title: "Sourcing Sustainable Stone",
    excerpt: "Tracing quarry provenance for each terrazzo slab and limestone block.",
    category: "Process",
  },
];

const featureStream = projects.flatMap((project, index) => [project, editorials[index % editorials.length]]);

featureStream.push(editorials[(projects.length + 1) % editorials.length]);

const layoutPattern = [
  { className: "md:col-span-4", tall: true },
  { className: "md:col-span-2" },
  { className: "md:col-span-3" },
  { className: "md:col-span-3" },
  { className: "md:col-span-2" },
  { className: "md:col-span-4", tall: true },
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

export default function HomePage() {
  return (
    <main id="top" className="space-y-24 pb-24">
      {/* Hero Intro */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-24 pt-28 text-center md:pt-32">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">EJ Development</p>
          <h1 className="font-serif text-4xl font-light leading-tight text-foreground md:text-6xl">
            Editorial living for the Costa del Sol.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            We choreograph architecture, interiors, and development strategy into cohesive experiences. Browse
            current and past work, ongoing research, and glimpses of Andalusian life on a single front page—our
            homage to classic property newspapers.
          </p>
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

      {/* Upcoming Flagship Placeholder */}
      <section id="upcoming" className="mx-auto max-w-6xl rounded-3xl border border-border bg-card px-6 py-16 md:px-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Next Release</p>
            <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">Casa Serrana</h2>
            <p className="text-sm text-muted-foreground">
              Our flagship 700 sqm villa in Sierra Blanca is in final detailing. Photography, floorplans, and the
              full brochure will publish shortly. Until then, consider this a reserved column awaiting its debut
              imagery.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Brochure Highlights To Come</p>
            <ul className="space-y-2">
              <li>Double-height great room opening to an 18m infinity pool.</li>
              <li>Primary suite with private solarium and Mediterranean views.</li>
              <li>Wellness wing featuring spa, gym, and plunge court.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Stream */}
      <section id="portfolio" className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Portfolio & Editorial</p>
            <h2 className="mt-2 font-serif text-4xl font-light text-foreground md:text-5xl">
              Projects in dialogue with stories
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Five completed developments flow beside current research and journal entries. Every card will become
            fully interactive once Supabase content is wired in.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(240px,auto)] gap-6 md:grid-cols-6">
          {featureStream.map((item, index) => {
            const layout = layoutPattern[index % layoutPattern.length];

            if (item.type === "project") {
              return (
                <article
                  key={`${item.title}-${index}`}
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
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
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">Completed Project</p>
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-light text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                      <span>{item.location}</span>
                      <span>View case study soon →</span>
                    </div>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={`${item.title}-${index}`}
                className={cn(
                  "flex h-full flex-col justify-between rounded-3xl border border-border bg-background/80 p-6 transition hover:border-primary",
                  layout.className,
                  layout.tall && "md:row-span-2",
                )}
              >
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">{item.category}</p>
                  <h3 className="font-serif text-2xl font-light text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Full editorial launching soon</span>
              </article>
            );
          })}
        </div>
      </section>

      {/* Instagram Strip */}
      <section id="instagram" className="bg-card py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Instagram</p>
            <h2 className="mt-3 font-serif text-3xl font-light text-foreground md:text-4xl">
              Coastal moments, daily
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            The live feed will pull from Supabase-cached Instagram data. Until then, enjoy a fresco of textures,
            botanicals, and glimpses from recent sites.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto px-6 pb-2 pt-2 md:justify-center">
            {instagramTiles.map((tile, index) => (
              <div key={`${tile}-${index}`} className="relative h-44 w-44 flex-shrink-0 overflow-hidden rounded-2xl">
                <Image src={tile} alt="Instagram highlight" fill className="object-cover" />
              </div>
            ))}
          </div>
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
            <Link href="mailto:hello@ejdevelopment.com" className="rounded-full border border-border px-5 py-2 hover:border-primary">
              hello@ejdevelopment.com
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
            <p className="mt-2">press@ejdevelopment.com</p>
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
