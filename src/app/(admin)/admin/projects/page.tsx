import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects as projectsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const db = getDb();
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Capture before/after narratives and hero imagery for the homepage stream.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add New Project
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Imagery</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => {
                const imagery = [project.beforeImagePath, project.afterImagePath].filter(Boolean).length;
                return (
                  <tr key={project.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{project.title}</div>
                        {project.year && (
                          <div className="text-xs text-muted-foreground">Completed {project.year}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{project.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-muted-foreground">
                        {imagery === 0 && "Hero only"}
                        {imagery === 1 && "Hero + one stage"}
                        {imagery >= 2 && "Hero + before/after"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={project.isPublished ? "text-green-600" : "text-yellow-600"}>
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(project.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Edit coming soon</span>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-xs text-primary hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No projects yet. Add your first project to unlock the portfolio stream.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
