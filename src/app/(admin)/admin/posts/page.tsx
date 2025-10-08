import Link from "next/link";

import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function PostsPage() {
  const db = getDb();
  const posts = await db.query.posts.findMany({
    orderBy: (table, { desc }) => [desc(table.updatedAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light">Blog Posts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Editorial coverage of the Marbella market, design process, and neighbourhood life.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Create Post
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    {post.excerpt && <div className="text-xs text-muted-foreground">{post.excerpt}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
                    {post.tags?.length ? post.tags.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={post.isPublished ? "text-emerald-600" : "text-yellow-600"}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(post.updatedAt ?? post.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}`} className="text-xs text-primary hover:underline">
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs text-muted-foreground hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No posts found. Draft your first article to publish on the journal.
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
