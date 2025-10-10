import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type ProjectCard = {
  id: string;
  title: string;
  summary: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string;
  isPublished: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description: "Our completed luxury property developments across the Costa del Sol, where every square meter is optimized with precision.",
};

export default async function ProjectsPage() {
  // Fetch projects from database
  let projects: ProjectCard[] = [];
  
  try {
    // Use direct database access instead of internal API call
    const { getDb } = await import('@/lib/db/index');
    const { projects: projectsSchema } = await import('@/lib/db/schema');
    const { desc } = await import('drizzle-orm');
    
    const db = getDb();
    const dbProjects = await db.select().from(projectsSchema).orderBy(desc(projectsSchema.createdAt));
    
    console.log('📊 Database returned projects:', dbProjects.length);
    console.log('📊 Projects data:', JSON.stringify(dbProjects, null, 2));
    
    // Filter only published projects
    projects = dbProjects
      .filter((project: any) => {
        console.log(`Project ${project.title}: isPublished=${project.isPublished}`);
        return project.isPublished;
      })
      .map((project: any) => ({
        id: project.id,
        title: project.title,
        summary: project.summary,
        year: project.year,
        facts: project.facts || {},
        heroImagePath: project.heroImagePath || 'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80',
        isPublished: project.isPublished
      }));
    
    console.log('📊 After filtering:', projects.length, 'published projects');
  } catch (error) {
    console.error('Error fetching projects:', error);
    projects = [];
  }

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
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No projects yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Check back soon for our latest luxury property developments.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={project.heroImagePath}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* SQM and Rooms overlay */}
                  {project.facts?.sqm && (
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                        {project.facts.sqm} m²
                      </span>
                    </div>
                  )}
                  {project.facts?.bedrooms && (
                    <div className="absolute bottom-4 right-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                        {project.facts.bedrooms} rum
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-light text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.summary}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                    <span>{project.year ? `${project.year}` : 'Coming soon'}</span>
                    <span>View case study soon →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
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
