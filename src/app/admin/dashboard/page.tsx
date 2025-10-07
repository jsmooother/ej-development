"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-light tracking-[0.15em] text-[#1a1a1a]">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-[#1a1a1a]/70 hover:text-[#1a1a1a]"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="rounded bg-[#1a1a1a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#c4a676]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/blog-posts"
            className="group rounded-lg border border-black/10 bg-white p-8 transition hover:border-[#c4a676] hover:shadow-lg"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c4a676]/10">
              <svg
                className="h-8 w-8 text-[#c4a676]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-light text-[#1a1a1a]">Blog Posts</h2>
            <p className="text-sm text-[#1a1a1a]/70">
              Manage editorial content and articles
            </p>
          </Link>

          <Link
            href="/admin/properties"
            className="group rounded-lg border border-black/10 bg-white p-8 transition hover:border-[#c4a676] hover:shadow-lg"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c4a676]/10">
              <svg
                className="h-8 w-8 text-[#c4a676]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-light text-[#1a1a1a]">Properties</h2>
            <p className="text-sm text-[#1a1a1a]/70">
              Manage property listings and details
            </p>
          </Link>

          <Link
            href="/admin/instagram"
            className="group rounded-lg border border-black/10 bg-white p-8 transition hover:border-[#c4a676] hover:shadow-lg"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c4a676]/10">
              <svg
                className="h-8 w-8 text-[#c4a676]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-light text-[#1a1a1a]">Instagram</h2>
            <p className="text-sm text-[#1a1a1a]/70">
              Manage Instagram feed posts
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

