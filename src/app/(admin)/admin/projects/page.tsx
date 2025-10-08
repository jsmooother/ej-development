import Link from "next/link";

import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
  const db = getDb();
  const projects = await db.query.projects.findMany({
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Case studies outlining completed developments and key facts.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Add New Project
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{project.title}</div>
                    {project.summary && (
                      <div className="text-xs text-muted-foreground">{project.summary}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">{project.year ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={project.isPublished ? "text-emerald-600" : "text-yellow-600"}>
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(project.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-xs text-muted-foreground hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No projects found. Start by adding a case study.
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
