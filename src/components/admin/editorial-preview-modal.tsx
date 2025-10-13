"use client";

import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface Editorial {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImagePath: string;
  additionalImages?: string[];
  isPublished: boolean;
}

interface EditorialPreviewModalProps {
  editorial: Editorial;
  isOpen: boolean;
  onClose: () => void;
}

export function EditorialPreviewModal({ editorial, isOpen, onClose }: EditorialPreviewModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Preview</h2>
            <span className="text-sm text-gray-500">
              {editorial.isPublished ? (
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
            {editorial.isPublished && (
              <a
                href={`/editorials/${editorial.slug}`}
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
          <article className="mx-auto max-w-3xl">
            {/* Cover Image */}
            {editorial.coverImagePath && (
              <div className="relative h-[400px] w-full bg-gray-200">
                <Image
                  src={editorial.coverImagePath}
                  alt={editorial.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8 bg-white">
              {/* Tags */}
              {editorial.tags && editorial.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {editorial.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-serif text-gray-900 mb-4">{editorial.title}</h1>

              {/* Excerpt */}
              {editorial.excerpt && (
                <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                  {editorial.excerpt}
                </p>
              )}

              {/* Content */}
              {editorial.content && (
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {editorial.content}
                  </div>
                </div>
              )}

              {/* Additional Images */}
              {editorial.additionalImages && editorial.additionalImages.length > 0 && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editorial.additionalImages.map((url, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
