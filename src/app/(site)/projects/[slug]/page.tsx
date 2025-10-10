import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string;
  isPublished: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
  };
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const headerList = headers();
    const protocol = headerList.get("x-forwarded-proto") ?? "http";
    const host =
      headerList.get("x-forwarded-host") ??
      headerList.get("host") ??
      `localhost:${process.env.PORT || 3000}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;
    const response = await fetch(new URL("/api/projects", baseUrl).toString(), {
      next: { revalidate: 60 }
    });

    if (!response.ok) return null;

    const projects = await response.json();
    const project = projects.find((p: Project) => p.slug === slug && p.isPublished);
    
    return project || null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  // Mock data for renovation before/after and gallery
  // In production, these would come from project_images table
  const beforeImages = [
    { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80', caption: 'Original exterior condition' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80', caption: 'Original interior layout' },
  ];

  const afterImages = [
    { url: project.heroImagePath || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', caption: 'Transformed exterior' },
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80', caption: 'Modern interior design' },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
  ];

  return (
    <main className="min-h-screen bg-[#f5f2ea]">
      {/* Minimalist Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/projects" className="text-xs font-medium uppercase tracking-[0.3em] text-gray-600 transition hover:text-black">
              ← All Projects
            </Link>
            <Link href="/" className="font-serif text-lg tracking-wider text-black">
              EJ PROPERTIES
            </Link>
            <button className="text-xs font-medium uppercase tracking-[0.3em] text-gray-600 transition hover:text-black">
              Share
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src={project.heroImagePath || afterImages[0].url}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-16 text-white">
            <div className="max-w-3xl space-y-6">
              <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em]">
                Project {project.year || '2024'}
              </div>
              <h1 className="font-serif text-5xl font-light leading-tight md:text-7xl">
                {project.title}
              </h1>
              <p className="text-lg leading-relaxed text-white/90 md:text-xl">
                {project.summary}
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-4 text-sm">
                {project.facts?.sqm && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>{project.facts.sqm} m²</span>
                  </div>
                )}
                {project.facts?.bedrooms && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{project.facts.bedrooms} Bedrooms</span>
                  </div>
                )}
                {project.facts?.bathrooms && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    <span>{project.facts.bathrooms} Bathrooms</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview - Luxury Magazine Style */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[2fr,1fr]">
          {/* Main Content */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light text-foreground">
                The Vision
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700">
                  {project.content || project.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Project Details */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                Project Details
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium text-black">{project.year || '2024'}</span>
                </div>
                {project.facts?.sqm && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Built Area</span>
                    <span className="font-medium text-black">{project.facts.sqm} m²</span>
                  </div>
                )}
                {project.facts?.plot && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Plot Size</span>
                    <span className="font-medium text-black">{project.facts.plot} m²</span>
                  </div>
                )}
                {project.facts?.bedrooms && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium text-black">{project.facts.bedrooms}</span>
                  </div>
                )}
                {project.facts?.bathrooms && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium text-black">{project.facts.bathrooms}</span>
                  </div>
                )}
                <div className="flex justify-between pb-3">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-black">Marbella, Spain</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="rounded-2xl bg-foreground p-8 text-white">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em]">
                Interested?
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-white/90">
                Request detailed project information, floor plans, and site visit scheduling.
              </p>
              <a
                href="mailto:hello@ejproperties.com"
                className="inline-block w-full rounded-lg bg-white px-6 py-3 text-center text-sm font-medium text-black transition hover:bg-white/90"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Showcase - Luxury Presentation */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-light text-black md:text-5xl">
              The Transformation
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gray-500">
              Before · After
            </p>
          </div>

          {/* Before/After Comparison - Side by Side */}
          <div className="space-y-12">
            {beforeImages.map((beforeImg, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-2">
                {/* Before */}
                <div className="group relative overflow-hidden">
                  <div className="relative h-[500px]">
                    <Image
                      src={beforeImg.url}
                      alt={beforeImg.caption}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="absolute top-6 left-6">
                    <div className="rounded-full bg-black/80 backdrop-blur-sm px-4 py-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Before</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-black">
                      {beforeImg.caption}
                    </p>
                  </div>
                </div>

                {/* After */}
                <div className="group relative overflow-hidden">
                  <div className="relative h-[500px]">
                    <Image
                      src={afterImages[index]?.url || afterImages[0].url}
                      alt={afterImages[index]?.caption || 'After renovation'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="absolute top-6 left-6">
                    <div className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-black">After</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="rounded-lg bg-black/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
                      {afterImages[index]?.caption || 'Transformed space'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Story - Editorial Style */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="space-y-8">
          <h2 className="font-serif text-3xl font-light text-foreground">
            Project Story
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-light first-letter:leading-none first-letter:text-foreground">
              {project.content || "This luxury renovation project represents the culmination of meticulous planning, exceptional craftsmanship, and a deep understanding of Mediterranean living. Every detail has been carefully considered to create a home that seamlessly blends traditional Andalusian architecture with contemporary luxury."}
            </p>
            
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                The transformation began with a comprehensive assessment of the property's bones—its structural integrity, spatial flow, and relationship to light. We preserved elements of architectural merit while reimagining the layout for modern living.
              </p>
              
              <p>
                Material selection prioritized authenticity and longevity. Natural stone flooring throughout, custom timber joinery crafted by local artisans, and Italian marble in bathrooms create a palette that will age gracefully while requiring minimal maintenance.
              </p>
              
              <p>
                The result is a home that honors its Mediterranean context while delivering the comfort and sophistication today's discerning residents expect. Every square meter has been optimized, every sightline considered, every material chosen with intention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Project Gallery - Masonry Style */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-light text-black md:text-5xl">
              Project Gallery
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gray-500">
              Selected Photography
            </p>
          </div>

          {/* Masonry-style gallery */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((imageUrl, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : 
                  index === 3 ? 'md:row-span-2' : ''
                }`}
              >
                <div className={`relative ${
                  index === 0 ? 'h-[600px]' : 
                  index === 3 ? 'h-[600px]' : 
                  'h-[280px]'
                }`}>
                  <Image
                    src={imageUrl}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Specifications - Luxury Table Format */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-2xl bg-white p-12 shadow-sm">
          <h2 className="mb-12 text-center font-serif text-3xl font-light text-black">
            Technical Specifications
          </h2>
          
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Architecture
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Total Built Area</span>
                    <span className="font-medium text-black">{project.facts?.sqm || 320} m²</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Plot Size</span>
                    <span className="font-medium text-black">{project.facts?.plot || 1200} m²</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Levels</span>
                    <span className="font-medium text-black">2 + Basement</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Interior
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium text-black">{project.facts?.bedrooms || 4}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium text-black">{project.facts?.bathrooms || 3}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Living Spaces</span>
                    <span className="font-medium text-black">3 Reception Rooms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Features
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Pool</span>
                    <span className="font-medium text-black">Infinity Edge</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-medium text-black">3 Covered Spaces</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Garden</span>
                    <span className="font-medium text-black">Landscaped</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Sustainability
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Energy Rating</span>
                    <span className="font-medium text-black">A+</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Solar Panels</span>
                    <span className="font-medium text-black">6 kW System</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Water</span>
                    <span className="font-medium text-black">Greywater Recycling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Highlight - Luxury Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
            Defining Features
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
              <svg className="h-8 w-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-light text-black">Natural Light</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Floor-to-ceiling windows and strategic orientation maximize natural illumination throughout the day.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
              <svg className="h-8 w-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-light text-black">Artisan Craft</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Custom millwork and locally-sourced materials executed by master craftspeople.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
              <svg className="h-8 w-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-light text-black">Sustainability</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              A+ energy rating with solar integration and passive climate control systems.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-4xl font-light md:text-5xl">
            Ready to Start Your Project?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Let's discuss how we can transform your vision into reality. 
            Our team specializes in luxury renovations that honor architectural heritage while embracing contemporary living.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@ejproperties.com"
              className="rounded-full bg-white px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:bg-white/90"
            >
              Schedule Consultation
            </a>
            <Link
              href="/projects"
              className="rounded-full border border-white px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="border-t border-gray-200 bg-[#f5f2ea] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
            <Link href="/projects" className="text-gray-600 transition hover:text-black">
              ← All Projects
            </Link>
            <span className="text-gray-400">© 2025 EJ Properties</span>
            <Link href="/" className="text-gray-600 transition hover:text-black">
              Home →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
