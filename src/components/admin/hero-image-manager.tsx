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

// Curated Unsplash images for quick selection
const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", name: "Modern Luxury Villa" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80", name: "Coastal Contemporary" },
  { url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80", name: "Mediterranean Estate" },
  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80", name: "Beachfront Property" },
  { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80", name: "Minimalist Interior" },
  { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80", name: "Garden & Pool" },
  { url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80", name: "Luxury Living Room" },
  { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80", name: "Modern Architecture" },
];

export function HeroImageManager({ 
  imageUrl, 
  onChange, 
  label = "Hero Image", 
  description,
  required = false 
}: HeroImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateImage = () => {
    if (newImageUrl.trim()) {
      onChange(newImageUrl.trim());
      setNewImageUrl("");
      setShowPresets(false);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  const selectPresetImage = (url: string) => {
    onChange(url);
    setShowPresets(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size: 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      setShowPresets(false);
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
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

      {/* Upload from Computer */}
      <div className="rounded-lg border-2 border-dashed border-border/50 bg-muted/10 p-6">
        <div className="flex items-center justify-center">
          <label className="flex cursor-pointer flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 transition-colors hover:bg-foreground/10">
              {isUploading ? (
                <svg className="h-8 w-8 animate-spin text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isUploading ? 'Uploading...' : 'Upload from Computer'}
              </p>
              <p className="text-xs text-muted-foreground/60">
                {isUploading ? `${uploadProgress}%` : 'Click to browse or drag & drop'}
              </p>
            </div>
          </label>
        </div>
        {isUploading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs font-medium text-muted-foreground/50">OR</span>
        </div>
      </div>

      {/* Add/Update image via URL */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-foreground/70">Use Image URL</p>
        <div className="flex gap-3">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://images.unsplash.com/photo-xxxxx..."
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
            {imageUrl ? "Update" : "Add"}
          </button>
        </div>

        {/* Quick Select Toggle */}
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60 transition hover:text-foreground"
        >
          <svg className={cn("h-3 w-3 transition-transform", showPresets && "rotate-90")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showPresets ? "Hide" : "Show"} quick select images
        </button>

        {/* Preset Images Grid */}
        {showPresets && (
          <div className="rounded-lg border border-border/30 bg-muted/10 p-4">
            <p className="mb-3 text-xs font-medium text-foreground/70">Click any image to use it:</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectPresetImage(preset.url)}
                  className="group relative overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-foreground/30 hover:shadow-md"
                  title={preset.name}
                >
                  <div className="relative h-20">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-white/90 p-1.5">
                      <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 truncate px-1 text-[10px] text-muted-foreground/60">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
