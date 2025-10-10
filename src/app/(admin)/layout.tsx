import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin Dashboard | EJ Properties",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
