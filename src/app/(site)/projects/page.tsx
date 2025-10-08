import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

type ProjectCard = {
  title: string;
  summary: string;
  location: string;
  image: string;
  sqm: number;
  rooms: number;
};

const projects: ProjectCard[] = [
  {
    title: "Sierra Horizon",
    summary: "Adaptive reuse opening a hillside estate toward the sea with layered courtyards.",
    location: "La Zagaleta · 2023",
    sqm: 420,
    rooms: 6,
    image: "https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Loma Azul",
    summary: "Minimalist cliffside retreat capturing Andalusian light from sunrise to dusk.",
    location: "Benahavís · 2022",
    sqm: 380,
    rooms: 5,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Casa Palma",
    summary: "Palm-framed sanctuary with shaded loggias and a terraced pool axis.",
    location: "Marbella Club · 2021",
    sqm: 320,
    rooms: 4,
    image: "https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Mirador Alto",
    summary: "Art-filled penthouse reimagined with sculptural joinery and panoramic glazing.",
    location: "Puerto Banús · 2020",
    sqm: 280,
    rooms: 3,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Villa Ladera",
    summary: "Split-level home cantilevered over native landscaping and a reflecting pool.",
    location: "Nueva Andalucía · 2019",
    sqm: 450,
    rooms: 7,
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80",
  },
];

export const metadata: Metadata = {
  title: "Projects",
  description: "Our completed luxury property developments across the Costa del Sol, where every square meter is optimized with precision.",
};

export default function ProjectsPage() {
  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Portfolio</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Completed Projects
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            From hilltop retreats to coastal sanctuaries, each project reflects our commitment to editorial living 
            and Andalusian architectural principles.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* SQM and Rooms overlay */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                    {project.sqm} m²
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                    {project.rooms} rum
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.summary}</p>
                </div>
                <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                  <span>{project.location}</span>
                  <span>View case study soon →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-6 text-center">
        <div className="rounded-3xl border border-border bg-card p-12">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Ready to create your next project?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Let's discuss your vision for the Costa del Sol.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
