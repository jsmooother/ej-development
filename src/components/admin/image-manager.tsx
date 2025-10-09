"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  description?: string;
}

export function ImageManager({ images, onChange, label = "Images", description }: ImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");

  const addImage = () => {
    if (newImageUrl.trim()) {
      onChange([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImage();
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div>
          <label className="block text-sm font-medium text-foreground">{label}</label>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
          )}
        </div>
      )}

      {/* Add new image */}
      <div className="flex gap-3">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://example.com/image.jpg"
          className="flex-1 rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={addImage}
          disabled={!newImageUrl.trim()}
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Image
        </button>
      </div>

      {/* Image list */}
      <div className="space-y-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            {/* Image preview */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              {image ? (
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-8 w-8 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* URL */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{image}</p>
              <p className="text-xs text-muted-foreground/60">Gallery Image {index + 1}</p>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="flex-shrink-0 rounded-lg bg-red-50 px-3 py-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
              title="Remove image"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 p-8 text-center">
          <svg className="mx-auto h-10 w-10 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-muted-foreground">No images yet</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Add your first image using the URL field above</p>
        </div>
      )}
    </div>
  );
}
