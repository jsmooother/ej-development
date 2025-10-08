import type { Route } from "next";
import Link from "next/link";

import { getDb } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function InstagramAdminPage() {
  const db = getDb();
  const settings = await db.query.siteSettings.findFirst();
  const latestCache = await db.query.instagramCache.findFirst({
    orderBy: (table, { desc }) => [desc(table.fetchedAt)],
  });

  const feedItems = Array.isArray((latestCache?.payload as { data?: unknown[] } | null)?.data)
    ? ((latestCache?.payload as { data?: unknown[] }).data as unknown[])
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light">Instagram Feed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Swap handles and tokens from settings. Cached responses keep the public feed resilient.
          </p>
        </div>
        <Link
          href={"/admin/site-settings" as Route}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:border-primary"
        >
          Update settings
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-light">Active Account</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Username</dt>
              <dd>@{settings?.primaryInstagramUsername ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Access token</dt>
              <dd className={settings?.instagramAccessToken ? "text-emerald-600" : "text-yellow-600"}>
                {settings?.instagramAccessToken ? "Configured" : "Missing"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Last sync</dt>
              <dd>{formatDateTime(latestCache?.fetchedAt ?? null) || "Never"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Cached posts</dt>
              <dd>{feedItems.length}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            Tokens live in <code className="mx-1 rounded bg-muted px-1.5 py-0.5">site_settings</code>. The cache hydrates
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5">instagram_cache</code> every 30–60 minutes.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-light">Latest Cache Snapshot</h2>
          {feedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cached media yet. Once credentials are live the cron job will hydrate this feed for the public site.
            </p>
          ) : (
            <ol className="space-y-3 text-sm">
              {feedItems.slice(0, 6).map((item, index) => {
                const node = item as { caption?: string; permalink?: string };
                return (
                  <li key={index} className="rounded-lg border border-border px-3 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Post #{index + 1}</span>
                      {node.permalink && (
                        <a
                          href={node.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View on Instagram
                        </a>
                      )}
                    </div>
                    {node.caption && <p className="mt-2 text-sm text-muted-foreground">{node.caption}</p>}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
