"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { compressImage, getOptimalCompressionSettings } from "@/lib/image-compression";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  useCase?: 'hero' | 'gallery' | 'thumbnail'; // For optimal compression
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "Click to upload image",
  className = "",
  maxSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"],
  useCase = 'gallery'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Please upload a valid image file (${acceptedTypes.join(", ")})`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Compress image before upload to save storage space
      console.log(`📦 Compressing image for ${useCase} use case...`);
      const compressedFile = await compressImage(file, getOptimalCompressionSettings(useCase));
      
      // Create FormData with compressed file
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("folder", "uploads"); // Organize by folder

      // Upload to Supabase Storage via our API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update preview and call onChange
      setPreview(data.url);
      onChange(data.url);

    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Upload area clicked, opening file dialog...');
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Area */}
      <div
        onClick={isUploading ? undefined : handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isUploading) handleClick(e as any);
          }
        }}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all
          ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
          ${preview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-gray-400"}
        `}
      >
        {preview ? (
          <div className="space-y-3">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-600 font-medium">✓ Image uploaded successfully</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{placeholder}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")} up to {maxSize}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* URL Input Fallback */}
      <div className="text-xs text-gray-500">
        <p>Or paste an image URL:</p>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value || ""}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
