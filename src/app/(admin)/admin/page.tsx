import Link from "next/link";
import { headers } from "next/headers";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";
import { StorageStatusIndicator } from "@/components/admin/storage-status-indicator";

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Fetch real data from database
  let listingsCount = 0;
  let projectsCount = 0;
  let postsCount = 0;
  let enquiriesCount = 0;
  let enquiriesSummary = { total: 0, recent: 0, recentDays: 7 };
  let recentProjects: any[] = [];
  let recentPosts: any[] = [];

  try {
    const headerList = headers();
    const protocol = headerList.get("x-forwarded-proto") ?? "http";
    const host =
      headerList.get("x-forwarded-host") ??
      headerList.get("host") ??
      `localhost:${process.env.PORT || 3000}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;

    // Fetch data from APIs
    const [projectsResponse, editorialsResponse, enquiriesResponse] = await Promise.all([
      fetch(`${baseUrl}/api/projects`),
      fetch(`${baseUrl}/api/editorials`),
      fetch(`${baseUrl}/api/enquiries`)
    ]);
    
    let projectsData = [];
    let editorialsData = [];
    let enquiriesData = [];
    
    if (projectsResponse.ok) {
      projectsData = await projectsResponse.json();
    } else {
      console.error('❌ Projects API failed:', {
        status: projectsResponse.status,
        statusText: projectsResponse.statusText,
        url: `${baseUrl}/api/projects`
      });
    }
    
    if (editorialsResponse.ok) {
      editorialsData = await editorialsResponse.json();
    } else {
      console.error('❌ Editorials API failed:', {
        status: editorialsResponse.status,
        statusText: editorialsResponse.statusText,
        url: `${baseUrl}/api/editorials`
      });
    }
    
    if (enquiriesResponse.ok) {
      const enquiriesResponseData = await enquiriesResponse.json();
      // Handle both old format (array) and new format (object with summary)
      if (Array.isArray(enquiriesResponseData)) {
        enquiriesData = enquiriesResponseData;
        enquiriesSummary = { total: enquiriesResponseData.length, recent: 0, recentDays: 7 };
      } else {
        enquiriesData = enquiriesResponseData.enquiries || [];
        enquiriesSummary = enquiriesResponseData.summary || { total: 0, recent: 0, recentDays: 7 };
      }
    } else {
      console.error('❌ Enquiries API failed:', {
        status: enquiriesResponse.status,
        statusText: enquiriesResponse.statusText,
        url: `${baseUrl}/api/enquiries`
      });
    }
    
    console.log('📊 Admin Dashboard:', {
      projectsResponse: projectsResponse.status,
      editorialsResponse: editorialsResponse.status,
      enquiriesResponse: enquiriesResponse.status,
      projectsData: projectsData?.length || 0,
      editorialsData: editorialsData?.length || 0,
      enquiriesData: enquiriesData?.length || 0,
      projectsUrl: `${baseUrl}/api/projects`,
      editorialsUrl: `${baseUrl}/api/editorials`,
      enquiriesUrl: `${baseUrl}/api/enquiries`
    });
    
    // Set counts
    projectsCount = Array.isArray(projectsData) ? projectsData.length : 0;
    postsCount = Array.isArray(editorialsData) ? editorialsData.length : 0;
    enquiriesCount = Array.isArray(enquiriesData) ? enquiriesData.length : 0;
    
    // Get recent projects (all projects, sorted by updatedAt)
    recentProjects = projectsData
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
      .map((project: any) => ({
        id: project.id,
        title: project.title,
        summary: `${project.year || 'Coming soon'}`,
        isPublished: project.isPublished
      }));
    
    // Get recent posts (all editorials, sorted by updatedAt)
    recentPosts = editorialsData
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
      .map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        isPublished: post.isPublished
      }));
    
    console.log('Dashboard counts from API:', { projectsCount, postsCount, listingsCount: 1, enquiriesCount });
    
    // For listings, we'll use known values for now
    listingsCount = 1; // We know there's 1 listing from the database
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Fallback to empty data on error
    listingsCount = 0;
    projectsCount = 0;
    postsCount = 0;
    enquiriesCount = 0;
    recentProjects = [];
    recentPosts = [];
  }

  return (
    <div>
      <AdminHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your content."
        rightContent={<StorageStatusIndicator />}
      />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Projects" 
            value={projectsCount} 
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatCard 
            title="Editorials" 
            value={postsCount} 
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
          <StatCard 
            title="Listings" 
            value={listingsCount} 
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M3 7V4a1 1 0 011-1h16a1 1 0 011 1v3M4 21v-8M20 21v-8M8 10v4M16 10v4" />
              </svg>
            }
          />
          <StatCard 
            title="Enquiries" 
            value={enquiriesCount} 
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            trend={enquiriesSummary.recent > 0 ? { 
              value: `${enquiriesSummary.recent} unanswered`, 
              positive: false 
            } : undefined}
          />
        </div>


        {/* Recent Activity */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/30 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Recent Projects</h2>
                <Link 
                  href="/admin/projects" 
                  className="group flex items-center gap-1 text-sm font-medium text-foreground transition-all hover:gap-2"
                >
                  View all
                  <svg className="h-4 w-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {recentProjects.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
                    <svg className="h-8 w-8 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">No projects yet</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">Create your first portfolio project</p>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-all hover:bg-foreground/[0.02]"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-foreground transition-colors group-hover:text-foreground">{project.title}</p>
                      <p className="text-xs text-muted-foreground/60">{project.summary}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                        project.isPublished 
                          ? "bg-green-50 text-green-700" 
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {project.isPublished ? "Live" : "Draft"}
                      </span>
                      <svg className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Editorials */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/30 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Recent Editorials</h2>
                <Link 
                  href="/admin/editorials" 
                  className="group flex items-center gap-1 text-sm font-medium text-foreground transition-all hover:gap-2"
                >
                  View all
                  <svg className="h-4 w-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {recentPosts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
                    <svg className="h-8 w-8 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">No editorials yet</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">Write your first article</p>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/editorials/${post.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-all hover:bg-foreground/[0.02]"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-foreground transition-colors group-hover:text-foreground">{post.title}</p>
                      <p className="text-xs text-muted-foreground/60">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                        post.isPublished 
                          ? "bg-green-50 text-green-700" 
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {post.isPublished ? "Live" : "Draft"}
                      </span>
                      <svg className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/projects/new"
              className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">New Project</p>
                <p className="text-xs text-muted-foreground/60">Add portfolio project</p>
              </div>
              <svg className="h-5 w-5 text-muted-foreground/40 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/admin/editorials/new"
              className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">New Editorial</p>
                <p className="text-xs text-muted-foreground/60">Write an article</p>
              </div>
              <svg className="h-5 w-5 text-muted-foreground/40 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/admin/settings/content-limits"
              className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Content Limits</p>
                <p className="text-xs text-muted-foreground/60">Configure display limits</p>
              </div>
              <svg className="h-5 w-5 text-muted-foreground/40 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}