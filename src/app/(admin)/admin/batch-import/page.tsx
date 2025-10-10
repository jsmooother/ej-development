"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import Link from "next/link";

export default function BatchImportGuidePage() {
  return (
    <div>
      <AdminHeader 
        title="Batch Import Guide" 
        description="Import multiple projects with images from local folders"
        action={{
          label: "Back to Projects",
          href: "/admin/projects"
        }}
      />

      <div className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Quick Start */}
          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-6 font-sans text-2xl font-medium text-foreground">Quick Start</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Set up Supabase Storage</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create a public bucket named <code className="rounded bg-muted px-1.5 py-0.5 text-xs">project-images</code> in your Supabase dashboard.
                  </p>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Open Supabase Dashboard
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Organize your images</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create folders in <code className="rounded bg-muted px-1.5 py-0.5 text-xs">project-images/</code> directory:
                  </p>
                  <div className="mt-3 rounded-lg bg-muted/50 p-4 font-mono text-xs">
                    <div className="text-muted-foreground">project-images/</div>
                    <div className="ml-4 text-muted-foreground">├── villa-serenidad/</div>
                    <div className="ml-8 text-foreground">│   ├── hero.jpg</div>
                    <div className="ml-8 text-muted-foreground">│   ├── before-1.jpg</div>
                    <div className="ml-8 text-muted-foreground">│   ├── after-1.jpg</div>
                    <div className="ml-8 text-muted-foreground">│   ├── gallery-1.jpg</div>
                    <div className="ml-8 text-muted-foreground">│   └── project.json</div>
                    <div className="ml-4 text-muted-foreground">└── finca-moderna/</div>
                    <div className="ml-8 text-muted-foreground">    └── ...</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Run the import script</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Open your terminal and run:
                  </p>
                  <div className="mt-3 rounded-lg bg-black p-4 font-mono text-sm text-green-400">
                    npm run import-projects
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                  ✓
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Done! Check your projects</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All projects will appear here with images uploaded to Supabase Storage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Naming Guide */}
          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-6 font-sans text-2xl font-medium text-foreground">File Naming Convention</h2>
            
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <code className="text-sm font-semibold">hero.jpg</code>
                  </div>
                  <p className="mt-2 text-xs text-green-700">Main project image</p>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <code className="text-sm font-semibold">before-*.jpg</code>
                  </div>
                  <p className="mt-2 text-xs text-amber-700">Before renovation photos</p>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center gap-2 text-purple-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <code className="text-sm font-semibold">after-*.jpg</code>
                  </div>
                  <p className="mt-2 text-xs text-purple-700">After renovation photos</p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <code className="text-sm font-semibold">gallery-*.jpg</code>
                  </div>
                  <p className="mt-2 text-xs text-blue-700">Gallery images</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/10 p-4">
                <p className="text-xs text-muted-foreground/70">
                  <strong>Examples:</strong> <code>hero.jpg</code>, <code>before-1.jpg</code>, <code>before-2.jpg</code>, <code>after-1.jpg</code>, <code>gallery-1.jpg</code>, <code>gallery-2.jpg</code>
                </p>
              </div>
            </div>
          </div>

          {/* Project Metadata (Optional) */}
          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-6 font-sans text-2xl font-medium text-foreground">Project Metadata (Optional)</h2>
            
            <p className="mb-4 text-sm text-muted-foreground">
              Create a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">project.json</code> file in each project folder with details:
            </p>

            <div className="rounded-lg bg-black p-4 font-mono text-xs text-green-400">
              <pre>{`{
  "title": "Villa Serenidad",
  "slug": "villa-serenidad",
  "summary": "La Zagaleta · 2024 - Luxury transformation",
  "content": "Full project description...",
  "year": 2024,
  "facts": {
    "sqm": 485,
    "plot": 2400,
    "bedrooms": 5,
    "bathrooms": 4
  },
  "isPublished": true,
  "isHero": false
}`}</pre>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-800">
                  If no <code>project.json</code> is provided, the script will auto-generate metadata from the folder name.
                </p>
              </div>
            </div>
          </div>

          {/* Command Reference */}
          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-6 font-sans text-2xl font-medium text-foreground">Command Reference</h2>
            
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Import all projects:</p>
                <div className="rounded-lg bg-black p-4 font-mono text-sm text-green-400">
                  npm run import-projects
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Check what would be imported (dry run):</p>
                <div className="rounded-lg bg-black p-4 font-mono text-sm text-green-400">
                  npm run import-projects -- --dry-run
                </div>
                <p className="mt-2 text-xs text-muted-foreground/60">
                  (Note: Dry run feature coming soon)
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
            <h2 className="mb-6 font-sans text-2xl font-medium text-green-900">Why Use Batch Import?</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-green-900">Fast & Efficient</h3>
                  <p className="text-xs text-green-700">Import 10+ projects in one command</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-green-900">Organized</h3>
                  <p className="text-xs text-green-700">Keep projects in separate folders</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-green-900">Safe Updates</h3>
                  <p className="text-xs text-green-700">Re-run to update existing projects</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-green-900">Auto-Categorized</h3>
                  <p className="text-xs text-green-700">Before/after/gallery sorted automatically</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Documentation Links */}
          <div className="flex gap-4">
            <Link
              href="/PROJECT_IMPORT_GUIDE.md"
              target="_blank"
              className="flex-1 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-foreground/30 hover:shadow-md"
            >
              <svg className="mx-auto h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-foreground">Full Import Guide</p>
              <p className="text-xs text-muted-foreground">Complete documentation</p>
            </Link>

            <Link
              href="/SUPABASE_STORAGE_SETUP.md"
              target="_blank"
              className="flex-1 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-foreground/30 hover:shadow-md"
            >
              <svg className="mx-auto h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-foreground">Supabase Setup</p>
              <p className="text-xs text-muted-foreground">Storage configuration</p>
            </Link>
          </div>

          {/* Need Help */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
            <p className="text-sm font-medium text-blue-900">Need help getting started?</p>
            <p className="mt-2 text-xs text-blue-700">
              Check the documentation files above or use the single-upload option in the 
              <Link href="/admin/projects/new" className="font-semibold underline"> New Project form</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

