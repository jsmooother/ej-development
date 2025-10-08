import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, projects } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
  // TODO: Re-enable database once connection is optimized
  // For now, using mock data for fast development
  const allProjects = [
    {
      id: '1',
      slug: 'sierra-horizon',
      title: 'Sierra Horizon',
      summary: 'La Zagaleta · 2023',
      facts: { sqm: 420, bedrooms: 6, bathrooms: 5 },
      heroImagePath: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80',
      isPublished: true,
      createdAt: new Date('2023-06-15'),
    },
    {
      id: '2',
      slug: 'loma-azul',
      title: 'Loma Azul',
      summary: 'Benahavís · 2022',
      facts: { sqm: 380, bedrooms: 5, bathrooms: 4 },
      heroImagePath: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      isPublished: true,
      createdAt: new Date('2022-09-20'),
    },
    {
      id: '3',
      slug: 'casa-palma',
      title: 'Casa Palma',
      summary: 'Marbella Club · 2021',
      facts: { sqm: 320, bedrooms: 4, bathrooms: 3 },
      heroImagePath: 'https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80',
      isPublished: true,
      createdAt: new Date('2021-05-10'),
    },
  ];

  return (
    <div>
      <AdminHeader 
        title="Projects" 
        description={`Manage your portfolio projects (${allProjects.length} total)`}
        action={{
          label: "+ New Project",
          href: "/admin/projects/new"
        }}
      />

      <div className="p-8">
        {allProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto max-w-md">
              <span className="text-6xl">🏗️</span>
              <h3 className="mt-4 font-serif text-2xl font-light">No projects yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first portfolio project. Showcase your work with beautiful imagery and detailed case studies.
              </p>
              <Link
                href="/admin/projects/new"
                className="mt-6 inline-block rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Create Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {allProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group rounded-xl border border-border bg-card transition hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Project Image Placeholder */}
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-3xl">
                    {project.heroImagePath ? (
                      <img 
                        src={project.heroImagePath} 
                        alt={project.title}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      "🏗️"
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-xl font-light group-hover:text-primary">
                          {project.title}
                        </h3>
                        {project.subtitle && (
                          <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
                        )}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.isPublished 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Project Meta */}
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {project.facts && typeof project.facts === 'object' && 'sqm' in project.facts && (
                        <span>📐 {project.facts.sqm} m²</span>
                      )}
                      {project.facts && typeof project.facts === 'object' && 'bedrooms' in project.facts && (
                        <span>🛏️ {project.facts.bedrooms} bedrooms</span>
                      )}
                      {project.location && typeof project.location === 'object' && 'locality' in project.location && (
                        <span>📍 {project.location.locality}</span>
                      )}
                      <span>🕒 Created {new Date(project.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Edit Arrow */}
                  <div className="text-muted-foreground group-hover:text-primary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

