import Link from "next/link";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { posts } from "@/drizzle";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function EditorialsPage() {
  const db = getDb();

  const editorials = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light">Editorials</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Articles feed the homepage grid and can be drafted automatically with OpenAI.
          </p>
        </div>
        <Link
          href="/admin/editorials/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Editorial
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {editorials.map((editorial) => {
                const category = editorial.tags?.[0] ?? "—";
                return (
                  <tr key={editorial.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{editorial.title}</div>
                        {editorial.excerpt && (
                          <div className="text-xs text-muted-foreground">
                            {editorial.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          editorial.isPublished ? "text-green-600" : "text-yellow-600"
                        }
                      >
                        {editorial.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(editorial.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Edit coming soon
                        </span>
                        <Link
                          href={`/editorial/${editorial.slug}`}
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

              {editorials.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No editorials yet. Use the AI generator to draft your first piece in
                    seconds.
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
