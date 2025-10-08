"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Projects", href: "/admin/projects", icon: "🏗️" },
  { name: "Editorials", href: "/admin/editorials", icon: "📝" },
  { name: "Listings", href: "/admin/listings", icon: "🏠" },
  { name: "Enquiries", href: "/admin/enquiries", icon: "💬" },
  { name: "Site Settings", href: "/admin/settings", icon: "⚙️" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo/Brand */}
      <div className="border-b border-border px-6 py-6">
        <h1 className="font-serif text-xl font-light tracking-wide">
          EJ Properties
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
            JK
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium">Jesper Kreuger</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

