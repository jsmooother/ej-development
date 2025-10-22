"use client";

import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type ImageTag = "before" | "after" | "gallery";

interface ProjectImage {
  id: string;
  url: string;
  tags: ImageTag[];
  caption?: string;
}

interface ImagePair {
  id: string;
  label: string;
  beforeImageId?: string;
  afterImageId?: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string;
  projectImages: ProjectImage[];
  imagePairs: ImagePair[];
  isPublished: boolean;
}

interface ProjectPreviewModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectPreviewModal({ project, isOpen, onClose }: ProjectPreviewModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get image by ID helper
  const getImageById = (imageId: string) => project.projectImages?.find(img => img.id === imageId);

  // Create proper before/after pairs from imagePairs data
  const imagePairs = project.imagePairs?.map(pair => {
    const beforeImage = getImageById(pair.beforeImageId || '');
    const afterImage = getImageById(pair.afterImageId || '');
    return {
      before: beforeImage ? {
        url: beforeImage.url,
        caption: pair.label || 'Before renovation'
      } : null,
      after: afterImage ? {
        url: afterImage.url,
        caption: pair.label || 'After renovation'
      } : null,
      label: pair.label
    };
  }).filter(pair => pair.before && pair.after) || [];

  // Fallback: if no pairs exist, show all tagged images separately
  const beforeImages = imagePairs.length > 0 ? [] : project.projectImages?.filter(img => img.tags.includes('before')).map(img => ({
    url: img.url,
    caption: 'Before renovation'
  })) || [];
  const afterImages = imagePairs.length > 0 ? [] : project.projectImages?.filter(img => img.tags.includes('after')).map(img => ({
    url: img.url,
    caption: 'After renovation'
  })) || [];

  const galleryImages = project.projectImages?.map(img => img.url) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Preview</h2>
            <span className="text-sm text-gray-500">
              {project.isPublished ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                  Draft
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {project.isPublished && (
              <a
                href={`/projects/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open Live Page
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close preview"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto max-w-4xl">
            {/* Hero Image */}
            {project.heroImagePath && (
              <div className="relative h-[400px] w-full bg-gray-200">
                <Image
                  src={project.heroImagePath}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8 bg-white">
              {/* Title & Summary */}
              <div className="mb-8">
                <h1 className="text-4xl font-serif text-gray-900 mb-4">{project.title}</h1>
                <p className="text-lg text-gray-600">{project.summary}</p>
              </div>

              {/* Facts */}
              {project.facts && Object.keys(project.facts).length > 0 && (
                <div className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
                  {Object.entries(project.facts).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm text-gray-500 capitalize">{key}</div>
                      <div className="text-lg font-medium text-gray-900">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Project Description */}
              {project.content && (
                <div className="mb-12 prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{project.content}</p>
                </div>
              )}

              {/* Before/After Pairs */}
              {imagePairs.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">Transformation</h2>
                  <div className="space-y-8">
                    {imagePairs.map((pair, index) => (
                      <div key={index} className="grid md:grid-cols-2 gap-4">
                        {pair.before && (
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                            <Image
                              src={pair.before.url}
                              alt="Before"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {pair.after && (
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                            <Image
                              src={pair.after.url}
                              alt="After"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.slice(0, 6).map((url, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={url}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
