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
    <main className="bg-[#f8f6f0]">
      {/* Classic Newspaper Masthead */}
      <header className="border-b-[3px] border-black bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between border-b border-gray-300 pb-4">
            <div className="text-xs text-gray-500">VOL. 2025</div>
            <div className="text-center flex-1">
              <h1 className="font-serif text-5xl font-black tracking-tight text-black md:text-6xl">
                THE EJ TIMES
              </h1>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.4em] text-gray-600">
                Editorial Collection
              </p>
            </div>
            <div className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-8 text-[10px] uppercase tracking-widest text-gray-600">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>·</span>
            <Link href="/projects" className="hover:text-black">Projects</Link>
            <span>·</span>
            <span className="font-bold text-black">Editorials</span>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <div className="border-b-2 border-black pb-6">
          <h2 className="font-serif text-4xl font-black uppercase text-black md:text-5xl">
            All Stories
          </h2>
          <p className="mt-3 text-sm uppercase tracking-widest text-gray-600">
            {editorials.length} {editorials.length === 1 ? 'Article' : 'Articles'} Published
          </p>
        </div>
      </section>

      {/* Editorials Grid - Newspaper Style */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        {editorials.length === 0 ? (
          <div className="border-2 border-black bg-white p-16 text-center">
            <div className="mx-auto max-w-md">
              <h3 className="font-serif text-2xl font-bold text-black">No Articles Published</h3>
              <p className="mt-2 text-sm text-gray-600">
                Check back soon for our latest insights and stories.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {editorials.map((editorial) => (
              <Link
                key={editorial.id}
                href={`/editorials/${editorial.slug}`}
                className="group block border-2 border-black bg-white transition-all hover:shadow-lg"
              >
                {editorial.coverImagePath && (
                  <div className="relative h-64 w-full border-b-2 border-black">
                    <Image
                      src={editorial.coverImagePath}
                      alt={editorial.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  {/* Tags and Date */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {editorial.tags.map((tag, index) => (
                      <span key={index} className="border border-black px-2 py-1 font-bold uppercase tracking-wider text-black">
                        {tag}
                      </span>
                    ))}
                    {editorial.publishedAt && (
                      <>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-600 uppercase">
                          {new Date(editorial.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-serif text-3xl font-black leading-tight text-black group-hover:underline">
                    {editorial.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="border-l-2 border-gray-400 pl-4 text-base leading-relaxed text-gray-700">
                    {editorial.excerpt}
                  </p>
                  
                  {/* Read More */}
                  <div className="pt-2 text-xs font-bold uppercase tracking-widest text-black">
                    Read Article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
      <footer className="border-t-[3px] border-black bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest">
            <Link
              href="/"
              className="group flex items-center gap-2 text-gray-600 transition hover:text-black"
            >
              <svg className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <div className="text-gray-500">© 2025 EJ Properties</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
