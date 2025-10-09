import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Editorial = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImagePath: string;
  tags: string[];
  publishedAt: string | null;
  isPublished: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const editorial = await getEditorial(params.slug);
  
  if (!editorial) {
    return {
      title: "Editorial Not Found",
    };
  }

  return {
    title: `${editorial.title} | Editorials`,
    description: editorial.excerpt,
  };
}

async function getEditorial(slug: string): Promise<Editorial | null> {
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
      next: { revalidate: 60 }
    });

    if (!response.ok) return null;

    const editorials = await response.json();
    const editorial = editorials.find((e: Editorial) => e.slug === slug && e.isPublished);
    
    return editorial || null;
  } catch (error) {
    console.error('Error fetching editorial:', error);
    return null;
  }
}

export default async function EditorialDetailPage({ params }: { params: { slug: string } }) {
  const editorial = await getEditorial(params.slug);

  if (!editorial) {
    notFound();
  }

  const publishedDate = editorial.publishedAt 
    ? new Date(editorial.publishedAt).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Draft';

  return (
    <main className="bg-white">
      {/* Newspaper Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-black md:text-6xl">
              EJ PROPERTIES
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-gray-600">
              Editorial
            </p>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <section className="mx-auto max-w-4xl px-6 pt-12">
        <div className="space-y-6 border-b border-gray-300 pb-8">
          {/* Category and Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {editorial.tags.length > 0 && (
                <>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {editorial.tags[0]}
                  </span>
                  <span className="text-gray-500">·</span>
                </>
              )}
              <span className="font-medium text-gray-600">{publishedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold leading-tight text-black md:text-5xl lg:text-6xl">
            {editorial.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl leading-relaxed text-gray-700 md:text-2xl">
            {editorial.excerpt}
          </p>

          {/* Author and Publication Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>By EJ Properties Editorial Team</span>
            <span>·</span>
            <span>Marbella, Costa del Sol</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {editorial.coverImagePath && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg md:h-[500px]">
            <Image
              src={editorial.coverImagePath}
              alt={editorial.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-4 text-center text-sm italic text-gray-600">
            {editorial.excerpt}
          </p>
        </section>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-6 pb-16">
        <div className="prose prose-lg max-w-none">
          <div 
            className="space-y-6 text-base leading-relaxed text-black md:text-lg"
            dangerouslySetInnerHTML={{ 
              __html: editorial.content
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                .replace(/^/, '<p>')
                .replace(/$/, '</p>')
            }}
          />
        </div>

        {/* Article Footer */}
        <div className="mt-16 border-t border-gray-300 pt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Published by EJ Properties</p>
              <p>Luxury Property Development · Marbella</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>© 2025 EJ Properties</p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-black md:text-4xl">
              More Stories
            </h2>
            <p className="mt-4 text-gray-600">
              Explore our latest insights and editorial content.
            </p>
            <Link
              href="/editorials"
              className="mt-6 inline-block rounded-full border-2 border-black bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white"
            >
              Read All Editorials
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/editorials"
              className="group flex items-center gap-2 text-sm font-medium text-gray-600 transition-all hover:gap-3 hover:text-black"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Editorials
            </Link>
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-medium text-gray-600 transition-all hover:gap-3 hover:text-black"
            >
              Home
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
