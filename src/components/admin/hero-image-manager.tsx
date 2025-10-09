"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeroImageManagerProps {
  imageUrl: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
}

export function HeroImageManager({ 
  imageUrl, 
  onChange, 
  label = "Hero Image", 
  description,
  required = false 
}: HeroImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");

  const updateImage = () => {
    if (newImageUrl.trim()) {
      onChange(newImageUrl.trim());
      setNewImageUrl("");
    }
  };

  const removeImage = () => {
    onChange("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateImage();
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div>
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
          )}
        </div>
      )}

      {/* Current hero image */}
      {imageUrl ? (
        <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Image preview */}
            <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={imageUrl}
                alt="Hero image preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Image info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Current Hero Image</p>
              <p className="mt-1 truncate text-xs text-muted-foreground/60">{imageUrl}</p>
              <p className="mt-2 text-xs text-muted-foreground/50">Main image displayed on project cards and detail pages</p>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={removeImage}
              className="flex-shrink-0 rounded-lg bg-red-50 px-3 py-2 text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
              title="Remove hero image"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 p-6 text-center">
          <svg className="mx-auto h-8 w-8 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm font-medium text-muted-foreground">No hero image set</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Add a hero image using the URL field below</p>
        </div>
      )}

      {/* Add/Update image */}
      <div className="flex gap-3">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://example.com/hero-image.jpg"
          className="flex-1 rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={updateImage}
          disabled={!newImageUrl.trim()}
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {imageUrl ? "Update Image" : "Add Image"}
        </button>
      </div>
    </div>
  );
}
