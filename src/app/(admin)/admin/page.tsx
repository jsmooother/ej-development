import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center">
      <div className="max-w-lg space-y-5">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Administration</p>
        <h1 className="font-serif text-3xl font-light text-foreground">Dashboard under construction</h1>
        <p className="text-sm text-muted-foreground">
          Supabase Auth with role-based access, content CRUD, PDF generation controls, and Instagram account
          management will land here shortly. In the meantime, review the README for setup instructions and the
          Drizzle schema for the underlying data model.
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.3em] hover:border-primary">
          Back to site
        </Link>
      </div>
    </div>
  );
}
