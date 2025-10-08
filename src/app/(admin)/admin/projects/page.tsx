import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, projects } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
  let allProjects: any[] = [];

  try {
    const db = getDb();
    allProjects = await db.select().from(projects).orderBy(sql`${projects.createdAt} DESC`);
  } catch (error) {
    console.error("Database error loading projects:", error);
    // Continue with empty array if database fails
  }

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

