"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";

type ImageCategory = "before" | "after" | "gallery";

interface CategorizedImage {
  id: string;
  url: string;
  category: ImageCategory;
  caption?: string;
}

interface CategorizedImageUploadProps {
  images: CategorizedImage[];
  onChange: (images: CategorizedImage[]) => void;
  label?: string;
  description?: string;
  maxImages?: number;
  showBeforeAfter?: boolean;
}

export function CategorizedImageUpload({
  images,
  onChange,
  label = "Project Images",
  description,
  maxImages = 20,
  showBeforeAfter = true
}: CategorizedImageUploadProps) {
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>("after");

  const addImage = (url: string, category: ImageCategory = selectedCategory) => {
    if (url.trim() && images.length < maxImages) {
      const newImage: CategorizedImage = {
        id: Date.now().toString(),
        url: url.trim(),
        category
      };
      onChange([...images, newImage]);
    }
    setUrlInput("");
    setIsAddingUrl(false);
  };

  const removeImage = (id: string) => {
    const newImages = images.filter(img => img.id !== id);
    onChange(newImages);
  };

  const updateImageCategory = (id: string, category: ImageCategory) => {
    const newImages = images.map(img => 
      img.id === id ? { ...img, category } : img
    );
    onChange(newImages);
  };

  const updateImageCaption = (id: string, caption: string) => {
    const newImages = images.map(img => 
      img.id === id ? { ...img, caption } : img
    );
    onChange(newImages);
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImage(urlInput);
    }
  };

  // Group images by category
  const beforeImages = images.filter(img => img.category === "before");
  const afterImages = images.filter(img => img.category === "after");
  const galleryImages = images.filter(img => img.category === "gallery");

  const getCategoryIcon = (category: ImageCategory) => {
    switch (category) {
      case "before": return "🔧";
      case "after": return "✨";
      case "gallery": return "🖼️";
      default: return "📷";
    }
  };

  const getCategoryColor = (category: ImageCategory) => {
    switch (category) {
      case "before": return "border-amber-200 bg-amber-50";
      case "after": return "border-green-200 bg-green-50";
      case "gallery": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <span>🔧 Before: {beforeImages.length}</span>
          <span>✨ After: {afterImages.length}</span>
          <span>🖼️ Gallery: {galleryImages.length}</span>
          <span>Total: {images.length}/{maxImages}</span>
        </div>
      </div>

      {/* Add New Image */}
      {images.length < maxImages && (
        <div className="space-y-3">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Upload new image:
            </label>
            <ImageUpload
              value=""
              onChange={(url) => addImage(url)}
              placeholder={`Upload ${selectedCategory} image`}
              className="max-w-md"
              maxSize={10}
              acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
            />
            <div className="flex gap-2">
              {(["before", "after", "gallery"] as ImageCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

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

      {/* Before/After Pairs Section */}
      {showBeforeAfter && (beforeImages.length > 0 || afterImages.length > 0) && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <span>🔄</span> Before & After Comparison
          </h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Before Images */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-amber-700 flex items-center gap-1">
                🔧 Before ({beforeImages.length})
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {beforeImages.map((image) => (
                  <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-amber-200">
                    <Image
                      src={image.url}
                      alt="Before renovation"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* After Images */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-green-700 flex items-center gap-1">
                ✨ After ({afterImages.length})
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {afterImages.map((image) => (
                  <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-green-200">
                    <Image
                      src={image.url}
                      alt="After renovation"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Images Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span>📸</span> All Images ({images.length})
        </h4>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image
                src={image.url}
                alt={`${image.category} image`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Category Badge */}
              <div className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(image.category)}`}>
                {getCategoryIcon(image.category)} {image.category}
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removeImage(image.id)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              
              {/* Category Selector */}
              <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <select
                  value={image.category}
                  onChange={(e) => updateImageCategory(image.id, e.target.value as ImageCategory)}
                  className="w-full rounded bg-white/90 px-2 py-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="before">🔧 Before</option>
                  <option value="after">✨ After</option>
                  <option value="gallery">🖼️ Gallery</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {/* Usage Instructions */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 How to use:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Before:</strong> Pre-renovation photos (will show in before/after comparison)</li>
          <li>• <strong>After:</strong> Post-renovation photos (will show in before/after comparison AND carousel)</li>
          <li>• <strong>Gallery:</strong> Additional photos (will show ONLY in carousel)</li>
          <li>• You can change categories by hovering over images and using the dropdown</li>
          <li>• The carousel will show all "After" + "Gallery" images</li>
        </ul>
      </div>
    </div>
  );
}
