import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard | EJ Development",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/10 px-4 py-6">
        <div className="mb-8">
          <Link href="/admin" className="text-sm font-medium text-foreground hover:text-primary">
            Dashboard
          </Link>
        </div>
        <nav className="space-y-6">
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Content</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/listings" className="text-foreground/80 hover:text-primary">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="/admin/projects" className="text-foreground/80 hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/admin/posts" className="text-foreground/80 hover:text-primary">
                  Blog Posts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Settings</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/site-settings" className="text-foreground/80 hover:text-primary">
                  Site Settings
                </Link>
              </li>
              <li>
                <Link href="/admin/instagram" className="text-foreground/80 hover:text-primary">
                  Instagram Feed
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">System</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/enquiries" className="text-foreground/80 hover:text-primary">
                  Enquiries
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-8">{children}</div>
      </main>
    </div>
  );
}
