import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type EditorialCard = {
  id: string;
  slug: string;
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
    // Use direct database access instead of internal API call
    const { getDb } = await import('@/lib/db/index');
    const { posts } = await import('@/lib/db/schema');
    const { desc } = await import('drizzle-orm');
    
    const db = getDb();
    const dbEditorials = await db.select().from(posts).orderBy(desc(posts.createdAt));
    
    console.log('📊 Database returned editorials:', dbEditorials.length);
    console.log('📊 Editorials data:', JSON.stringify(dbEditorials, null, 2));
    
    // Filter only published editorials
    editorials = dbEditorials
      .filter((editorial: any) => {
        console.log(`Editorial ${editorial.title}: isPublished=${editorial.isPublished}`);
        return editorial.isPublished;
      })
      .map((editorial: any) => ({
        id: editorial.id,
        slug: editorial.slug,
        title: editorial.title,
        excerpt: editorial.excerpt || '',
        coverImagePath: editorial.coverImagePath || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        tags: editorial.tags || [],
        publishedAt: editorial.publishedAt,
        isPublished: editorial.isPublished
      }));
    
    console.log('📊 After filtering:', editorials.length, 'published editorials');
  } catch (error) {
    console.error('Error fetching editorials:', error);
    editorials = [];
  }

  return (
    <main className="space-y-24 pb-24">
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Editorial</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">All Stories</h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Insights on property, design, architecture, and the craft behind refined living on the Costa del Sol.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
            {editorials.length} {editorials.length === 1 ? "Article" : "Articles"} Published
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        {editorials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <h3 className="font-serif text-2xl font-light text-foreground">No editorials yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/70">
                Check back soon for our latest stories and project insights.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {editorials.map((editorial) => (
              <Link
                key={editorial.id}
                href={`/editorials/${editorial.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                {editorial.coverImagePath && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={editorial.coverImagePath}
                      alt={editorial.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {editorial.tags.map((tag, index) => (
                      <span key={index} className="rounded-full border border-border px-2 py-1 uppercase tracking-[0.2em] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                    {editorial.publishedAt && (
                      <span className="uppercase tracking-[0.2em] text-muted-foreground/80">
                        {new Date(editorial.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-3xl font-light leading-tight text-foreground">{editorial.title}</h2>
                  <p className="text-sm text-muted-foreground">{editorial.excerpt}</p>
                  <p className="mt-auto text-xs uppercase tracking-[0.3em] text-muted-foreground/80">Read article →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
