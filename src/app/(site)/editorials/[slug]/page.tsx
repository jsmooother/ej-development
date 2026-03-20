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
    <main className="space-y-20 pb-24">
      <section className="mx-auto max-w-5xl px-6 pt-28 md:pt-32">
        <div className="space-y-6">
          {editorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {editorial.tags.map((tag, index) => (
                <span key={index} className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-serif text-4xl font-light leading-tight text-foreground md:text-6xl">{editorial.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground md:text-xl">{editorial.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
            <span>Editorial Team</span>
            <span>•</span>
            <time>{publishedDate}</time>
          </div>
        </div>
      </section>

      {editorial.coverImagePath && (
        <section className="mx-auto max-w-6xl px-6">
          <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-border md:h-[520px]">
            <Image src={editorial.coverImagePath} alt={editorial.title} fill className="object-cover" priority />
          </div>
        </section>
      )}

      <article className="mx-auto max-w-3xl px-6">
        <div
          className="space-y-6 text-base leading-relaxed text-muted-foreground [&_a]:underline [&_a]:decoration-muted-foreground/60 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: editorial.content.replace(/\n/g, "<br />") }}
        />
      </article>

      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">Continue Reading</h2>
          <p className="mt-3 text-sm text-muted-foreground">Explore more stories from EJ Properties.</p>
          <Link
            href="/editorials"
            className="mt-6 inline-block rounded-full border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            All Editorials
          </Link>
        </div>
      </section>
    </main>
  );
}
