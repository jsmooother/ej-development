import Link from "next/link";
import { count } from "drizzle-orm";

import {
  checkDatabaseHealth,
  enquiries,
  getDb,
  listings,
  posts,
  projects,
} from "@/lib/db";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";

type ActivityItem = {
  id: string;
  label: string;
  type: "Listing" | "Project" | "Post" | "Enquiry";
  timestamp: Date | null;
  href: string;
};

export default async function AdminDashboardPage() {
  const db = getDb();

  const [listingsCount, projectsCount, postsCount, enquiriesCount] = await Promise.all([
    db
      .select({ value: count() })
      .from(listings)
      .then((rows) => Number(rows.at(0)?.value ?? 0)),
    db
      .select({ value: count() })
      .from(projects)
      .then((rows) => Number(rows.at(0)?.value ?? 0)),
    db
      .select({ value: count() })
      .from(posts)
      .then((rows) => Number(rows.at(0)?.value ?? 0)),
    db
      .select({ value: count() })
      .from(enquiries)
      .then((rows) => Number(rows.at(0)?.value ?? 0)),
  ]);

  const [recentListings, recentProjects, recentPosts, recentEnquiries, databaseHealth] =
    await Promise.all([
      db.query.listings.findMany({
        columns: {
          id: true,
          title: true,
          createdAt: true,
        },
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit: 4,
      }),
      db.query.projects.findMany({
        columns: {
          id: true,
          title: true,
          createdAt: true,
        },
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit: 4,
      }),
      db.query.posts.findMany({
        columns: {
          id: true,
          title: true,
          createdAt: true,
        },
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit: 4,
      }),
      db.query.enquiries.findMany({
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit: 4,
      }),
      checkDatabaseHealth(),
    ]);

  const recentActivity: ActivityItem[] = [
    ...recentListings.map((item) => ({
      id: item.id,
      label: item.title,
      type: "Listing" as const,
      timestamp: item.createdAt,
      href: `/admin/listings/${item.id}`,
    })),
    ...recentProjects.map((item) => ({
      id: item.id,
      label: item.title,
      type: "Project" as const,
      timestamp: item.createdAt,
      href: `/admin/projects/${item.id}`,
    })),
    ...recentPosts.map((item) => ({
      id: item.id,
      label: item.title,
      type: "Post" as const,
      timestamp: item.createdAt,
      href: `/admin/posts/${item.id}`,
    })),
    ...recentEnquiries.map((item) => ({
      id: item.id,
      label: item.name,
      type: "Enquiry" as const,
      timestamp: item.createdAt,
      href: `/admin/enquiries`,
    })),
  ]
    .sort((a, b) => {
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 6);

  const stats = [
    { label: "Active Listings", value: listingsCount },
    { label: "Case Studies", value: projectsCount },
    { label: "Blog Posts", value: postsCount },
    { label: "Enquiries", value: enquiriesCount },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to the admin panel. Monitor content, review enquiries, and keep the Marbella villa experience up to date.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <div className="space-y-4 rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-light">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">
                Latest updates across listings, projects, posts, and inbound enquiries.
              </p>
            </div>
            <Link href="/admin/enquiries" className="text-xs font-medium text-primary hover:underline">
              View all enquiries
            </Link>
          </div>

          <div className="divide-y divide-border">
            {recentActivity.length === 0 && (
              <p className="py-8 text-sm text-muted-foreground">No activity recorded yet.</p>
            )}
            {recentActivity.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between gap-4 py-4 transition hover:text-primary"
              >
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {item.type}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{formatDateTime(item.timestamp)}</div>
                  <div>{formatRelativeTime(item.timestamp)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-light">Database Status</h2>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                databaseHealth.ok
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {databaseHealth.ok ? "Healthy" : "Check connection"}
            </span>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Host</dt>
              <dd>{databaseHealth.info.host}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Database</dt>
              <dd>{databaseHealth.info.database ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Connection mode</dt>
              <dd>{databaseHealth.info.usesDirectConnection ? "Direct" : "Pooled"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">SSL</dt>
              <dd>{databaseHealth.info.usesSsl ? "Enabled" : "Disabled"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Latency</dt>
              <dd>{databaseHealth.ok ? `${databaseHealth.latencyMs.toFixed(2)} ms` : "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Last checked</dt>
              <dd>{formatDateTime(databaseHealth.checkedAt)}</dd>
            </div>
          </dl>
          {!databaseHealth.ok && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {databaseHealth.error}
              {databaseHealth.details ? ` · Code: ${databaseHealth.details}` : null}
            </p>
          )}
          <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <p>
              Connection pooling is {databaseHealth.info.usesPgbouncer ? "managed by PgBouncer" : "currently disabled"}. Adjust
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5">SUPABASE_DB_URL</code> or
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5">DIRECT_URL</code> if needed.
            </p>
            <p>Use the seed script after migrations to populate sample data.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 space-y-4 rounded-lg border border-border p-6">
          <h2 className="font-serif text-xl font-light">Quick Links</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/listings"
              className="rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:border-primary"
            >
              Manage Listings
            </Link>
            <Link
              href="/admin/projects"
              className="rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:border-primary"
            >
              Manage Projects
            </Link>
            <Link
              href="/admin/posts"
              className="rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:border-primary"
            >
              Manage Blog Posts
            </Link>
            <Link
              href="/admin/site-settings"
              className="rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:border-primary"
            >
              Site Settings
            </Link>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="font-serif text-xl font-light">Next Steps</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Confirm Supabase Auth roles align with profiles table.</li>
            <li>Upload floorplans and brochure PDFs to the documents bucket.</li>
            <li>Switch the Instagram handle once new credentials are ready.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
