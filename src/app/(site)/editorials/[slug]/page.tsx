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
                Property · Design · Architecture
              </p>
            </div>
            <div className="text-xs text-gray-500">{publishedDate.split(',')[0]}</div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-8 text-[10px] uppercase tracking-widest text-gray-600">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>·</span>
            <Link href="/editorials" className="hover:text-black">All Stories</Link>
            <span>·</span>
            <Link href="/projects" className="hover:text-black">Projects</Link>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="space-y-6">
          {/* Category Tags */}
          {editorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {editorial.tags.map((tag, index) => (
                <span key={index} className="border border-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title with Classic Newspaper Style */}
          <h1 className="font-serif text-5xl font-black leading-[1.1] text-black md:text-6xl lg:text-7xl">
            {editorial.title}
          </h1>

          {/* Deck (Subtitle/Excerpt) */}
          <p className="border-l-4 border-black pl-6 font-serif text-2xl leading-relaxed text-gray-800 md:text-3xl">
            {editorial.excerpt}
          </p>

          {/* Byline */}
          <div className="flex items-center gap-4 border-t border-b border-gray-400 py-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                EJ
              </div>
              <div>
                <p className="font-semibold text-black">Editorial Team</p>
                <p className="text-xs text-gray-600">Marbella, Costa del Sol</p>
              </div>
            </div>
            <span className="text-gray-400">·</span>
            <time className="text-gray-600">{publishedDate}</time>
          </div>
        </div>
      </section>

      {/* Hero Image - Full Bleed */}
      {editorial.coverImagePath && (
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <figure className="space-y-3">
            <div className="relative h-[450px] w-full overflow-hidden border-2 border-black md:h-[600px]">
              <Image
                src={editorial.coverImagePath}
                alt={editorial.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="border-l-2 border-gray-400 pl-4 text-sm italic text-gray-600">
              {editorial.excerpt}
            </figcaption>
          </figure>
        </section>
      )}

      {/* Article Content - Blog style with newspaper aesthetic */}
      <article className="mx-auto max-w-4xl px-6 pb-16">
        {/* Drop cap on first paragraph */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="first-letter:float-left first-letter:mr-4 first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.8] first-letter:font-serif space-y-6 text-lg leading-relaxed text-gray-900"
            dangerouslySetInnerHTML={{ 
              __html: editorial.content
                .split('\n\n')
                .map((paragraph, index) => {
                  // Check if paragraph contains an image URL pattern
                  const imageMatch = paragraph.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                  if (imageMatch) {
                    const altText = imageMatch[1] || 'Editorial image';
                    const imageUrl = imageMatch[2];
                    return `
                      <figure class="my-12 -mx-6 md:-mx-12">
                        <img 
                          src="${imageUrl}" 
                          alt="${altText}"
                          class="w-full h-auto border-y-2 border-black"
                        />
                        ${altText ? `<figcaption class="mt-3 border-l-2 border-gray-400 pl-4 text-sm italic text-gray-600">${altText}</figcaption>` : ''}
                      </figure>
                    `;
                  }
                  
                  // Check for pull quotes (lines starting with >)
                  if (paragraph.startsWith('>')) {
                    const quote = paragraph.replace(/^>\s*/, '');
                    return `
                      <blockquote class="my-8 border-l-4 border-black bg-gray-50 py-6 px-8 italic">
                        <p class="text-2xl font-serif leading-relaxed text-gray-800">"${quote}"</p>
                      </blockquote>
                    `;
                  }
                  
                  // Regular paragraph
                  return `<p class="mb-6 leading-relaxed">${paragraph.replace(/\n/g, '<br>')}</p>`;
                })
                .join('')
            }}
          />
        </div>

        {/* Closing Line */}
        <div className="mt-16 border-t-2 border-black pt-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-black">
            ■
          </p>
        </div>

        {/* Article Footer Info Box */}
        <div className="mt-8 border-2 border-black bg-gray-50 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">About The Publisher</h3>
              <p className="mt-2 font-serif text-lg text-gray-900">EJ Properties</p>
              <p className="text-sm text-gray-600">Luxury Property Development</p>
              <p className="text-sm text-gray-600">Marbella, Costa del Sol</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">Get In Touch</h3>
              <p className="mt-2 text-sm text-gray-600">Editorial Inquiries</p>
              <p className="text-sm text-gray-600">editorial@ejproperties.com</p>
              <p className="text-sm text-gray-600">+34 600 123 456</p>
            </div>
          </div>
        </div>
      </article>

      {/* More From This Edition - Newspaper style */}
      <section className="border-t-[3px] border-black bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-b-2 border-black pb-3 mb-8">
            <h2 className="font-serif text-3xl font-black uppercase text-black">
              More From This Edition
            </h2>
          </div>
          <div className="text-center space-y-4">
            <p className="text-sm uppercase tracking-widest text-gray-600">
              Continue Reading The EJ Times
            </p>
            <Link
              href="/editorials"
              className="inline-block border-2 border-black bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
            >
              All Editorials
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <footer className="border-t border-gray-300 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-widest">
            <Link
              href="/editorials"
              className="group flex items-center gap-2 text-gray-600 transition hover:text-black"
            >
              <svg className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Index
            </Link>
            <Link
              href="/"
              className="group flex items-center gap-2 text-gray-600 transition hover:text-black"
            >
              Home Page
              <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
