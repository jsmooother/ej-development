"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { cn } from "@/lib/utils";

interface HeroImageManagerProps {
  imageUrl: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
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
  required = false,
  placeholder = "Upload hero image"
}: HeroImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const updateImage = () => {
    if (newImageUrl.trim()) {
      onChange(newImageUrl.trim());
      setNewImageUrl("");
      setShowPresets(false);
    }
  };

  const selectPresetImage = (url: string) => {
    onChange(url);
    setShowPresets(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateImage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Upload Component */}
      <ImageUpload
        value={imageUrl}
        onChange={onChange}
        placeholder={placeholder}
        className="max-w-lg"
        maxSize={10}
        acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
      />

      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs font-medium text-muted-foreground/50">OR</span>
        </div>
      </div>

      {/* Quick Select Preset Images */}
      <div className="space-y-3">
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
