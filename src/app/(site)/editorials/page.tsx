import Image from "next/image";
import type { Metadata } from "next";
import { headers } from "next/headers";

type EditorialCard = {
  id: string;
  title: string;
  excerpt: string;
  coverImagePath: string;
  tags: string[];
  publishedAt: string | null;
  isPublished: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Editorials",
  description: "Insights, guides, and stories from our practice in precision property development and refined living.",
};

export default async function EditorialsPage() {
  // Fetch editorials from database
  let editorials: EditorialCard[] = [];
  
  try {
    const headerList = headers();
    const protocol = headerList.get("x-forwarded-proto") ?? "http";
    const host =
      headerList.get("x-forwarded-host") ??
      headerList.get("host") ??
      `localhost:${process.env.PORT || 3000}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;
    const response = await fetch(new URL("/api/editorials", baseUrl).toString(), {
      cache: 'no-store' // Ensure fresh data
    });
    
    console.log('📊 Fetch URL:', new URL("/api/editorials", baseUrl).toString());
    console.log('📊 Response status:', response.status, response.statusText);
    
    if (response.ok) {
      const dbEditorials = await response.json();
      console.log('📊 API returned editorials:', dbEditorials.length);
      console.log('📊 Editorials data:', JSON.stringify(dbEditorials, null, 2));
      
      // Filter only published editorials
      editorials = dbEditorials
        .filter((editorial: EditorialCard) => {
          console.log(`Editorial ${editorial.title}: isPublished=${editorial.isPublished}`);
          return editorial.isPublished;
        })
        .map((editorial: EditorialCard) => ({
          id: editorial.id,
          title: editorial.title,
          excerpt: editorial.excerpt,
          coverImagePath: editorial.coverImagePath || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
          tags: editorial.tags || [],
          publishedAt: editorial.publishedAt,
          isPublished: editorial.isPublished
        }));
      
      console.log('📊 After filtering:', editorials.length, 'published editorials');
    }
  } catch (error) {
    console.error('Error fetching editorials:', error);
    editorials = [];
  }

  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Editorial</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Stories & Insights
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            From market analysis to design philosophy, explore our perspective on luxury living 
            and architectural practice in Andalusia.
          </p>
        </div>
      </section>

      {/* Editorials Grid */}
      <section className="mx-auto max-w-6xl px-6">
        {editorials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No editorials yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Check back soon for our latest insights and stories.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {editorials.map((editorial) => (
              <article
                key={editorial.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {editorial.coverImagePath && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={editorial.coverImagePath}
                      alt={editorial.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center gap-2">
                    {editorial.tags.length > 0 && (
                      <>
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-red-600">
                          {editorial.tags[0]}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {editorial.publishedAt ? new Date(editorial.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Draft'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-light text-foreground">{editorial.title}</h3>
                    <p className="text-sm text-muted-foreground">{editorial.excerpt}</p>
                  </div>
                  <div className="mt-auto">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Read full article →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Subscribe to receive our latest editorials and project updates.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full border border-border bg-background px-6 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <button className="rounded-full border border-foreground bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground/90">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
