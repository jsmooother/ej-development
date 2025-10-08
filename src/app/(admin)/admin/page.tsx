import { sql } from "drizzle-orm";
import { getDb, listings, projects, posts, enquiries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = getDb();
  
  // Fetch summary counts
  const [
    { count: listingsCount } = { count: 0 },
    { count: projectsCount } = { count: 0 },
    { count: postsCount } = { count: 0 },
    { count: enquiriesCount } = { count: 0 },
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(listings).then(([r]) => r),
    db.select({ count: sql<number>`count(*)::int` }).from(projects).then(([r]) => r),
    db.select({ count: sql<number>`count(*)::int` }).from(posts).then(([r]) => r),
    db.select({ count: sql<number>`count(*)::int` }).from(enquiries).then(([r]) => r),
  ]);

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
          Welcome to the admin panel. Here you can manage your content and settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 space-y-4 rounded-lg border border-border p-4">
          <h2 className="font-serif text-xl font-light">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Coming soon: Activity feed showing recent content updates and enquiries.</p>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="font-serif text-xl font-light">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/admin/listings/new"
              className="block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add New Listing
            </a>
            <a
              href="/admin/posts/new"
              className="block rounded-md bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20"
            >
              Create Blog Post
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}