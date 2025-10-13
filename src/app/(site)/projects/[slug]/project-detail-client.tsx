"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type ProjectImage = {
  id: string;
  url: string;
  tags: string[];
};

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string | null;
  projectImages: ProjectImage[];
  imagePairs: any[];
  isPublished: boolean;
};

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [beforeAfterExpanded, setBeforeAfterExpanded] = useState(false);

  // Auto-focus the carousel when it opens for immediate keyboard navigation
  useEffect(() => {
    if (lightboxOpen) {
      const carouselElement = document.querySelector('[data-carousel="lightbox"]') as HTMLElement;
      if (carouselElement) {
        carouselElement.focus();
      }
    }
  }, [lightboxOpen]);

  // Helper function to get image by ID
  const getImageById = (imageId: string) => project.projectImages.find(img => img.id === imageId);
  
  // Create before/after pairs from imagePairs data
  const beforeAfterPairs = (project.imagePairs?.map((pair: any) => {
    const beforeImage = getImageById(pair.beforeImageId);
    const afterImage = getImageById(pair.afterImageId);
    if (!beforeImage || !afterImage) return null;
    return {
      id: pair.id,
      title: pair.label || 'Before & After',
      before: beforeImage,
      after: afterImage
    };
  }).filter((pair): pair is { id: string; title: string; before: ProjectImage; after: ProjectImage } => pair !== null) || []);

  // Get all gallery images (images tagged as "gallery")
  const galleryImages = project.projectImages.filter(img => 
    img.tags.includes('gallery')
  );

  // Debug logging
  console.log('🔍 Project images debug:', {
    totalImages: project.projectImages.length,
    galleryImages: galleryImages.length,
    imageTags: project.projectImages.map(img => ({ id: img.id, tags: img.tags })),
    beforeAfterPairs: beforeAfterPairs.length
  });

  // Combine all images for lightbox (before/after pairs + gallery images)
  const allImages = [
    ...beforeAfterPairs.flatMap(pair => [pair.before, pair.after]),
    ...galleryImages
  ].filter(Boolean);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <main className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[70vh] w-full overflow-hidden">
          {project.heroImagePath ? (
            <Image
              src={project.heroImagePath}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <p className="text-gray-500">No hero image available</p>
            </div>
          )}
        </div>
        
        {/* Project Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-4 text-white">
              <h1 className="text-4xl font-serif md:text-6xl">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.3em]">
                {project.year && <span>{project.year}</span>}
                {project.facts?.Type && <span>{project.facts.Type}</span>}
                {project.facts?.Status && <span>{project.facts.Status}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Story */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="space-y-8">
          <h2 className="text-3xl font-serif">Project Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {project.content}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-6xl px-6">
          <div className="space-y-8">
            <h2 className="text-center text-3xl font-serif">Gallery</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt={`${project.title} - Gallery ${index + 1}`}
                    fill
                    className="object-cover cursor-pointer transition-transform hover:scale-105"
                    onClick={() => openLightbox(allImages.findIndex(img => img?.id === image.id))}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Before/After Pairs - Collapsible */}
      {beforeAfterPairs.length > 0 && (
        <section className="mx-auto max-w-6xl px-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif">Transformation</h2>
              <button
                onClick={() => setBeforeAfterExpanded(!beforeAfterExpanded)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                aria-expanded={beforeAfterExpanded}
                aria-label={beforeAfterExpanded ? "Collapse before/after images" : "Expand all before/after images"}
              >
                {beforeAfterExpanded ? (
                  <>
                    <span>Show Less</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>View All ({beforeAfterPairs.length})</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-24">
              {/* First pair - always visible */}
              {beforeAfterPairs.slice(0, 1).map((pair) => (
                <div key={pair.id} className="space-y-6">
                  <h3 className="text-center text-xl font-medium">{pair.title}</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">Before</h4>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={pair.before.url}
                          alt={`${pair.title} - Before`}
                          fill
                          className="object-cover cursor-pointer transition-transform hover:scale-105"
                          onClick={() => openLightbox(allImages.findIndex(img => img?.id === pair.before.id))}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">After</h4>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={pair.after.url}
                          alt={`${pair.title} - After`}
                          fill
                          className="object-cover cursor-pointer transition-transform hover:scale-105"
                          onClick={() => openLightbox(allImages.findIndex(img => img?.id === pair.after.id))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Remaining pairs - collapsible */}
              {beforeAfterExpanded && beforeAfterPairs.slice(1).map((pair) => (
                <div key={pair.id} className="space-y-6">
                  <h3 className="text-center text-xl font-medium">{pair.title}</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">Before</h4>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={pair.before.url}
                          alt={`${pair.title} - Before`}
                          fill
                          className="object-cover cursor-pointer transition-transform hover:scale-105"
                          onClick={() => openLightbox(allImages.findIndex(img => img?.id === pair.before.id))}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">After</h4>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={pair.after.url}
                          alt={`${pair.title} - After`}
                          fill
                          className="object-cover cursor-pointer transition-transform hover:scale-105"
                          onClick={() => openLightbox(allImages.findIndex(img => img?.id === pair.after.id))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Start Your Project
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              aria-label="Close lightbox"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div
              data-carousel="lightbox"
              className="relative focus:outline-none"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              {allImages[currentImageIndex] && (
                <Image
                  src={allImages[currentImageIndex].url}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-h-[90vh] w-auto object-contain"
                  priority
                />
              )}
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Previous image"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Next image"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
