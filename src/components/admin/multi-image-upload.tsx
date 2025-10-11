"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { X } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  description?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  images,
  onChange,
  label = "Images",
  description,
  maxImages = 10
}: MultiImageUploadProps) {
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const addImage = (url: string) => {
    if (url.trim() && !images.includes(url) && images.length < maxImages) {
      onChange([...images, url.trim()]);
    }
    setUrlInput("");
    setIsAddingUrl(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImage(urlInput);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {images.length}/{maxImages} images
        </p>
      </div>

      {/* Current Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      {images.length < maxImages && (
        <div className="space-y-3">
          {/* File Upload */}
          <ImageUpload
            value=""
            onChange={(url) => addImage(url)}
            placeholder={`Upload image ${images.length + 1}`}
            className="max-w-md"
            maxSize={10}
            acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
          />

          {/* URL Input Option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Or add via URL:</span>
              {!isAddingUrl && (
                <button
                  onClick={() => setIsAddingUrl(true)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Add URL
                </button>
              )}
            </div>

            {isAddingUrl && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={handleUrlKeyPress}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none"
                />
                <button
                  onClick={() => addImage(urlInput)}
                  disabled={!urlInput.trim()}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingUrl(false);
                    setUrlInput("");
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Max Images Warning */}
      {images.length >= maxImages && (
        <p className="text-xs text-amber-600">
          Maximum of {maxImages} images reached. Remove an image to add more.
        </p>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
          <div className="mb-4 text-muted-foreground">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">No images yet</p>
          <p className="text-xs text-muted-foreground">Upload your first image using the uploader above</p>
        </div>
      )}
    </div>
  );
}
