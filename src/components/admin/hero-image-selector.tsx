"use client";

import Image from "next/image";
import { Check, Star } from "lucide-react";

interface ProjectImage {
  id: string;
  url: string;
  tags: string[];
}

interface HeroImageSelectorProps {
  images: ProjectImage[];
  selectedHeroImageUrl: string | null;
  onSelectHeroImage: (imageUrl: string | null) => void;
  label?: string;
  description?: string;
}

export function HeroImageSelector({
  images,
  selectedHeroImageUrl,
  onSelectHeroImage,
  label = "Hero Image",
  description = "Choose the main image displayed on project cards and detail pages"
}: HeroImageSelectorProps) {
  if (images.length === 0) {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            {label}
          </label>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Upload images first, then select your hero image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          {label}
        </label>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Current Hero Image Preview */}
      {selectedHeroImageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Current Hero Image:</p>
          <div className="relative w-full h-48 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={selectedHeroImageUrl}
              alt="Current hero image"
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                <Star className="h-3 w-3" />
                Hero
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Selection Grid */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Select from uploaded images:
        </p>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelectHeroImage(image.url)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedHeroImageUrl === image.url
                  ? "border-yellow-500 ring-2 ring-yellow-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image.url}
                alt="Project image"
                fill
                className="object-cover"
              />
              
              {/* Selection indicator */}
              {selectedHeroImageUrl === image.url && (
                <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                  <div className="bg-yellow-500 text-white p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
              
              {/* Tags indicator */}
              <div className="absolute top-1 right-1 flex gap-1">
                {image.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-1 py-0.5 rounded ${
                      tag === "before" 
                        ? "bg-orange-500 text-white" 
                        : tag === "after"
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        
        {/* Remove hero image option */}
        {selectedHeroImageUrl && (
          <button
            type="button"
            onClick={() => onSelectHeroImage(null)}
            className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Remove hero image
          </button>
        )}
      </div>
    </div>
  );
}
