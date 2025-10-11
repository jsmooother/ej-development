"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { X, Tag } from "lucide-react";
import Image from "next/image";

type ImageTag = "before" | "after" | "gallery";

interface TaggedImage {
  id: string;
  url: string;
  tags: ImageTag[];
  caption?: string;
}

interface TaggedImageUploadProps {
  images: TaggedImage[];
  onChange: (images: TaggedImage[]) => void;
  label?: string;
  description?: string;
  maxImages?: number;
}

export function TaggedImageUpload({
  images,
  onChange,
  label = "Project Images",
  description,
  maxImages = 20
}: TaggedImageUploadProps) {
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const addImage = (url: string) => {
    if (url.trim() && images.length < maxImages) {
      const newImage: TaggedImage = {
        id: Date.now().toString(),
        url: url.trim(),
        tags: ["after"] // Default to "after" for new images
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

  const toggleTag = (imageId: string, tag: ImageTag) => {
    const newImages = images.map(img => {
      if (img.id === imageId) {
        const hasTag = img.tags.includes(tag);
        return {
          ...img,
          tags: hasTag 
            ? img.tags.filter(t => t !== tag)
            : [...img.tags, tag]
        };
      }
      return img;
    });
    onChange(newImages);
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImage(urlInput);
    }
  };

  const getTagColor = (tag: ImageTag) => {
    switch (tag) {
      case "before": return "bg-orange-50 text-orange-700 border-orange-200";
      case "after": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "gallery": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTagLabel = (tag: ImageTag) => {
    switch (tag) {
      case "before": return "Before";
      case "after": return "After";
      case "gallery": return "Gallery";
      default: return tag;
    }
  };

  // Count images by tag
  const beforeImages = images.filter(img => img.tags.includes("before"));
  const afterImages = images.filter(img => img.tags.includes("after"));
  const galleryImages = images.filter(img => img.tags.includes("gallery"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        <div className="mt-3 flex gap-6 text-sm text-gray-600">
          <span className="font-medium">Before: <span className="font-normal">{beforeImages.length}</span></span>
          <span className="font-medium">After: <span className="font-normal">{afterImages.length}</span></span>
          <span className="font-medium">Gallery: <span className="font-normal">{galleryImages.length}</span></span>
          <span className="font-medium text-gray-500">Total: {images.length}/{maxImages}</span>
        </div>
      </div>

      {/* Add New Image */}
      {images.length < maxImages && (
        <div className="space-y-3">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Add Image</label>
            <ImageUpload
              value=""
              onChange={addImage}
              placeholder="Choose image or drag and drop"
              className="max-w-md"
              maxSize={10}
              acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
            />
          </div>

          {/* URL Input Option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Or add via URL:</span>
              {!isAddingUrl && (
                <button
                  onClick={() => setIsAddingUrl(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add URL
                </button>
              )}
            </div>

            {isAddingUrl && (
              <div className="flex gap-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={handleUrlKeyPress}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => addImage(urlInput)}
                  disabled={!urlInput.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingUrl(false);
                    setUrlInput("");
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4" />
            All Images ({images.length})
          </h4>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <Image
                  src={image.url}
                  alt="Project image"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                
                {/* Tags */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-wrap gap-1">
                    {(["before", "after", "gallery"] as ImageTag[]).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(image.id, tag)}
                        className={`rounded-full px-2 py-1 text-xs font-medium border transition-colors ${
                          image.tags.includes(tag)
                            ? getTagColor(tag)
                            : "bg-white/90 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                        title={`Click to ${image.tags.includes(tag) ? 'remove' : 'add'} ${tag} tag`}
                      >
                        {tag}
                        {image.tags.includes(tag) && <span className="ml-1">✓</span>}
                      </button>
                    ))}
                  </div>
                  {image.tags.length > 1 && (
                    <div className="mt-1 text-xs text-white bg-black/50 rounded px-2 py-1">
                      {image.tags.length} tags active
                    </div>
                  )}
                </div>
                
                {/* Active Tags Overlay */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {image.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-2 py-1 text-xs font-medium border ${getTagColor(tag)}`}
                    >
                      {getTagIcon(tag)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
          <div className="mb-4 text-muted-foreground">
            <Tag className="mx-auto h-12 w-12" />
          </div>
          <p className="text-sm text-muted-foreground">No images yet</p>
          <p className="text-xs text-muted-foreground">Upload your first image and tag it as needed</p>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 How to use multiple tags:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Upload images and they default to "After" ✨ tag</li>
          <li>• <strong>Hover over images</strong> to see tag buttons</li>
          <li>• <strong>Click tags</strong> to add/remove them - <strong>images can have multiple tags!</strong></li>
          <li>• <strong>🔧 Before:</strong> Pre-renovation photos</li>
          <li>• <strong>✨ After:</strong> Post-renovation photos (shown in carousel)</li>
          <li>• <strong>🖼️ Gallery:</strong> Additional photos (shown in carousel)</li>
          <li>• <strong>Multiple tags example:</strong> Tag as "After + Gallery" to show in both comparison AND carousel</li>
          <li>• <strong>Tag as "Before + After"</strong> to show in before/after comparison</li>
          <li>• <strong>Tag as "After + Gallery"</strong> to show in carousel with other after photos</li>
        </ul>
      </div>
    </div>
  );
}
