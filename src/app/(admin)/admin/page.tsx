import { sql } from "drizzle-orm";
import Link from "next/link";
import { getDb, listings, projects, posts, enquiries } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";

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

  // Fetch recent items
  const recentProjects = await db.select().from(projects).orderBy(sql`${projects.createdAt} DESC`).limit(5);
  const recentPosts = await db.select().from(posts).orderBy(sql`${posts.createdAt} DESC`).limit(5);

  return (
    <div>
      <AdminHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your content."
      />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Projects" 
            value={projectsCount} 
            icon="🏗️"
            trend={{ value: "+2 this month", positive: true }}
          />
          <StatCard 
            title="Editorials" 
            value={postsCount} 
            icon="📝"
            trend={{ value: "+5 this month", positive: true }}
          />
          <StatCard 
            title="Listings" 
            value={listingsCount} 
            icon="🏠"
          />
          <StatCard 
            title="Enquiries" 
            value={enquiriesCount} 
            icon="💬"
            trend={{ value: "+12 this week", positive: true }}
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-light">Recent Projects</h2>
                <Link 
                  href="/admin/projects" 
                  className="text-sm text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentProjects.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No projects yet. Create your first one!
                </div>
              ) : (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-muted"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      project.isPublished 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Editorials */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-light">Recent Editorials</h2>
                <Link 
                  href="/admin/editorials" 
                  className="text-sm text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentPosts.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No editorials yet. Create your first one!
                </div>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/editorials/${post.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-muted"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      post.isPublished 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 font-serif text-lg font-light">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition hover:border-primary"
            >
              <span className="text-3xl">🏗️</span>
              <div>
                <p className="font-medium">New Project</p>
                <p className="text-sm text-muted-foreground">Add a portfolio project</p>
              </div>
            </Link>
            <Link
              href="/admin/editorials/new"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition hover:border-primary"
            >
              <span className="text-3xl">📝</span>
              <div>
                <p className="font-medium">New Editorial</p>
                <p className="text-sm text-muted-foreground">Write an article</p>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition hover:border-primary"
            >
              <span className="text-3xl">⚙️</span>
              <div>
                <p className="font-medium">Site Settings</p>
                <p className="text-sm text-muted-foreground">Configure your site</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
