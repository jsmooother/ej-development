import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const response = await fetch(`${baseUrl}/api/projects`, {
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

  // Mock data for additional project assets (in real app, these would come from database)
  const projectAssets = {
    images: [
      { url: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80', caption: 'Main living space' },
      { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80', caption: 'Master bedroom suite' },
      { url: 'https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80', caption: 'Kitchen and dining area' },
      { url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80', caption: 'Exterior facade' },
      { url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80', caption: 'Garden and pool area' },
    ],
    beforeImages: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80', caption: 'Before renovation - original state' },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80', caption: 'Before renovation - kitchen area' },
    ],
    floorPlans: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', caption: 'Ground floor plan' },
      { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80', caption: 'Upper floor plan' },
    ],
    documents: [
      { name: 'Project Specification', type: 'PDF', size: '2.3 MB' },
      { name: 'Material Selection Guide', type: 'PDF', size: '1.8 MB' },
      { name: 'Energy Efficiency Report', type: 'PDF', size: '0.9 MB' },
    ]
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-medium text-gray-600 transition-all hover:gap-3 hover:text-black"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO PROJECTS
            </Link>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Puroform Style */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="grid gap-16 lg:grid-cols-3 lg:gap-24">
          {/* Hero Image - 60% width */}
          <div className="lg:col-span-2">
            <div className="relative h-[600px] w-full overflow-hidden rounded-lg">
              <Image
                src={project.heroImagePath || projectAssets.images[0].url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Project Info - 40% width */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl font-light text-black md:text-5xl">
                {project.title.toUpperCase()}
              </h1>
              
              {/* Project Specs Table - Puroform Style */}
              <div className="border-t border-gray-200 pt-6">
                <table className="w-full text-sm">
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Project Name</td>
                      <td className="py-2 font-medium text-black">{project.title}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Size</td>
                      <td className="py-2 font-medium text-black">{project.facts?.sqm || 320} m² Built, {project.facts?.plot || 1200} m² Plot</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Project Year</td>
                      <td className="py-2 font-medium text-black">{project.year || '2024'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Location</td>
                      <td className="py-2 font-medium text-black">Marbella, Spain</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-1 border-t border-gray-200">
              {/* Description */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Description
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 text-sm leading-relaxed text-gray-700">
                  <p>{project.summary}</p>
                  {project.content && (
                    <div className="mt-4" dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br>') }} />
                  )}
                </div>
              </details>

              {/* Facts */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Facts
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 space-y-3">
                  {project.facts && Object.entries(project.facts).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium text-black">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Energy Rating</span>
                    <span className="font-medium text-black">A+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-medium text-black">2 spaces</span>
                  </div>
                </div>
              </details>

              {/* Gallery */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Gallery
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {projectAssets.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative h-24 overflow-hidden rounded">
                      <Image
                        src={image.url}
                        alt={image.caption}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </details>

              {/* Before & After */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Before & After
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 space-y-4">
                  <h4 className="text-sm font-medium text-black">Transformation Journey</h4>
                  <div className="grid gap-4">
                    {projectAssets.beforeImages.map((image, index) => (
                      <div key={index} className="relative h-32 overflow-hidden rounded">
                        <Image
                          src={image.url}
                          alt={image.caption}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                          {image.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {/* Floor Plans */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Floor Plans
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 space-y-4">
                  {projectAssets.floorPlans.map((plan, index) => (
                    <div key={index} className="relative h-48 overflow-hidden rounded border">
                      <Image
                        src={plan.url}
                        alt={plan.caption}
                        fill
                        className="object-contain bg-gray-50"
                      />
                      <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-black">
                        {plan.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              {/* Documents */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Documents & Links
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 space-y-2">
                  {projectAssets.documents.map((doc, index) => (
                    <a key={index} href="#" className="flex items-center justify-between rounded border p-3 text-sm transition hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
                          PDF
                        </div>
                        <span className="font-medium text-black">{doc.name}</span>
                      </div>
                      <span className="text-gray-500">{doc.size}</span>
                    </a>
                  ))}
                </div>
              </details>

              {/* Contact */}
              <details className="group border-b border-gray-200 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium uppercase tracking-wide text-black">
                  Interest Registration
                  <svg className="h-4 w-4 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </summary>
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-700">Interested in this project? Contact us for more information.</p>
                  <div className="space-y-2">
                    <a href="mailto:hello@ejproperties.com" className="block text-sm font-medium text-black hover:underline">
                      hello@ejproperties.com
                    </a>
                    <a href="tel:+34600123456" className="block text-sm font-medium text-black hover:underline">
                      +34 600 123 456
                    </a>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Project Description Section - Puroform Style */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              {project.summary}
            </p>
            
            {project.content && (
              <div 
                className="mt-8 text-lg leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: project.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^/, '<p>').replace(/$/, '</p>') }}
              />
            )}
            
            {/* Enhanced project description inspired by Puroform */}
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-700">
              <p>
                This magnificent property seamlessly blends classical architecture with the minimalist elegance of Scandinavian bespoke interiors, creating a harmonious living space that is both luxurious and inviting. The home features an array of sophisticated amenities that cater to every aspect of modern living and well-being.
              </p>
              
              <p>
                The property's social heart is its open-plan living and dining area, which derives its distinctive character from high vaulted ceilings adorned with timber beams. This space is further enhanced by a double-sided tiled fireplace, which not only adds warmth but also acts as a stunning visual divider between the living area and the custom-designed kitchen.
              </p>
              
              <p>
                Outside, the garden becomes a vibrant social hub with its sunken chill-out lounge, featuring a swim-up bespoke bar next to the large L-shaped pool. This area serves as a breathtaking focal point both visually and socially, encouraging relaxation and engagement amidst its lush surroundings.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-8">
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-medium text-gray-600 transition-all hover:gap-3 hover:text-black"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO PROJECTS
            </Link>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Project
            </button>
          </div>
        </div>
      </section>

      {/* Full Gallery Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-light text-black">VIEW FULL GALLERY</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectAssets.images.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="relative h-80">
                  <Image
                    src={image.url}
                    alt={image.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-medium">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section - Puroform Style */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-light text-black mb-8">Explore</h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600">Services</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Property Development</li>
                  <li>Interior Design</li>
                  <li>Project Management</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600">Projects</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><Link href="/projects" className="hover:text-black transition">All Projects</Link></li>
                  <li><Link href="/projects?status=in-progress" className="hover:text-black transition">In Progress</Link></li>
                  <li><Link href="/projects?status=completed" className="hover:text-black transition">Completed</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600">Contact</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><a href="mailto:hello@ejproperties.com" className="hover:text-black transition">hello@ejproperties.com</a></p>
                  <p><a href="tel:+34600123456" className="hover:text-black transition">+34 600 123 456</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>© Copyright 2025 EJ Properties.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition">Privacy Policy</a>
              <a href="#" className="hover:text-black transition">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
