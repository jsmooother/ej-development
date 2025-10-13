"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { compressImage, getOptimalCompressionSettings } from "@/lib/image-compression";
import { Upload, X, Plus } from "lucide-react";

type ImageTag = "before" | "after" | "gallery";

interface ProjectImage {
  id: string;
  url: string;
  tags: ImageTag[];
}

interface MultiFileImageUploadProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  placeholder?: string;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  maxImages?: number;
  useCase?: 'hero' | 'gallery' | 'thumbnail'; // For optimal compression
}

export function MultiFileImageUpload({
  images,
  onChange,
  placeholder = "Click to upload images",
  className = "",
  maxSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"],
  maxImages = 20
}: MultiFileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed max
    if (images.length + files.length > maxImages) {
      setError(`Cannot add ${files.length} images. Maximum ${maxImages} images allowed. You currently have ${images.length} images.`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadingCount(files.length);

    const newImages: ProjectImage[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Process files in parallel
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          throw new Error(`File ${index + 1}: Invalid file type. Please upload ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")} files.`);
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${index + 1}: File size must be less than ${maxSize}MB`);
        }

        // Create FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "uploads");

        // Upload to Supabase Storage via our API
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`File ${index + 1}: Upload failed`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(`File ${index + 1}: ${data.error}`);
        }

        successCount++;
        return {
          id: Date.now().toString() + index,
          url: data.url,
          tags: ["gallery"] // Default to gallery
        };
      } catch (error) {
        errorCount++;
        console.error(`Upload error for file ${index + 1}:`, error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const validImages = results.filter(img => img !== null) as ProjectImage[];
      
      if (validImages.length > 0) {
        onChange([...images, ...validImages]);
      }

      if (errorCount > 0) {
        setError(`${successCount} images uploaded successfully. ${errorCount} images failed to upload.`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadingCount(0);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canAddMore && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canAddMore || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Check if adding these files would exceed max
    if (images.length + files.length > maxImages) {
      setError(`Cannot add ${files.length} images. Maximum ${maxImages} images allowed. You currently have ${images.length} images.`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadingCount(files.length);

    const newImages: ProjectImage[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Process files in parallel
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          throw new Error(`File ${index + 1}: Invalid file type. Please upload ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")} files.`);
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${index + 1}: File size must be less than ${maxSize}MB`);
        }

        // Create FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "uploads");

        // Upload to Supabase Storage via our API
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`File ${index + 1}: Upload failed`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(`File ${index + 1}: ${data.error}`);
        }

        successCount++;
        return {
          id: Date.now().toString() + index,
          url: data.url,
          tags: ["gallery"] // Default to gallery
        };
      } catch (error) {
        errorCount++;
        console.error(`Upload error for file ${index + 1}:`, error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const validImages = results.filter((img): img is ProjectImage => img !== null);
      
      if (validImages.length > 0) {
        onChange([...images, ...validImages]);
      }

      if (errorCount > 0) {
        setError(`${successCount} image(s) uploaded successfully. ${errorCount} failed.`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadingCount(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const confirmDeleteImage = async () => {
    if (imageToDelete === null) return;
    
    const imageToRemove = images[imageToDelete];
    
    if (imageToRemove?.url) {
      try {
        // Extract file path from Supabase URL
        const url = new URL(imageToRemove.url);
        const filePath = url.pathname.split('/storage/v1/object/public/images/')[1];
        
        if (filePath) {
          // Delete from Supabase Storage
          const response = await fetch('/api/storage/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath }),
          });
          
          if (!response.ok) {
            console.error('Failed to delete file from storage:', await response.text());
          } else {
            console.log('✅ File deleted from storage:', filePath);
          }
        }
      } catch (error) {
        console.error('Error deleting file from storage:', error);
      }
    }
    
    // Remove from images array
    const newImages = images.filter((_, i) => i !== imageToDelete);
    onChange(newImages);
    
    // Close the modal
    setImageToDelete(null);
  };

  const addImageFromUrl = async () => {
    if (!urlInput.trim()) return;

    try {
      setIsUploading(true);
      setError(null);

      // Validate URL format
      try {
        new URL(urlInput);
      } catch {
        throw new Error("Please enter a valid URL");
      }

      // Add the URL as a ProjectImage object
      const newImage: ProjectImage = {
        id: Date.now().toString(),
        url: urlInput.trim(),
        tags: ["gallery"] // Default to gallery
      };
      
      onChange([...images, newImage]);
      setUrlInput("");
      setIsAddingUrl(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add image from URL");
    } finally {
      setIsUploading(false);
    }
  };

  // Check if more images can be added
  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
        multiple
      />

      {/* Upload Area */}
      <div
        onClick={canAddMore ? handleClick : undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all
          ${canAddMore ? "cursor-pointer border-gray-300 hover:border-gray-400 hover:bg-gray-50" : "border-gray-200 bg-gray-50 cursor-not-allowed"}
          ${isDragging ? "border-blue-500 bg-blue-50" : ""}
          ${isUploading ? "opacity-50" : ""}
        `}
      >
        {isUploading ? (
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-600">
              Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
            </p>
          </div>
        ) : canAddMore ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto text-gray-400">
              <Upload className="w-12 h-12" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{placeholder}</p>
              <p className="text-xs text-gray-500 mt-1">
                {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")} up to {maxSize}MB each
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Click to select multiple images or drag and drop
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto text-gray-400">
              <Upload className="w-12 h-12" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Maximum images reached</p>
              <p className="text-xs text-gray-500 mt-1">
                You have reached the limit of {maxImages} images
              </p>
            </div>
          </div>
        )}
      </div>

      {/* URL Input Option */}
      {canAddMore && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Or add via URL:</span>
            {!isAddingUrl && (
              <button
                type="button"
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
                onKeyPress={(e) => e.key === "Enter" && addImageFromUrl()}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={addImageFromUrl}
                disabled={isUploading || !urlInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingUrl(false);
                  setUrlInput("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Uploaded Images ({images.length})
            </h4>
            {canAddMore && (
              <button
                type="button"
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add More Images
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div 
                  className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => setPreviewImage(image)}
                >
                  <Image
                    src={image.url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageToDelete(index);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="relative aspect-video w-full bg-gray-100">
                <Image
                  src={previewImage.url}
                  alt="Image preview"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const index = images.findIndex(img => img.id === previewImage.id);
                      if (index !== -1) {
                        setImageToDelete(index);
                        setPreviewImage(null);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {imageToDelete !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setImageToDelete(null)}
        >
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Image</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this image? This will remove it from storage and cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteImage()}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
