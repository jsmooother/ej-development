"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "./image-upload";
import { MultiFileImageUpload } from "./multi-file-image-upload";
import { X, Plus, ArrowRight, Tag, Grid3X3, Link, Star } from "lucide-react";
import Image from "next/image";

type ImageTag = "before" | "after" | "gallery";
type WorkflowStep = "upload" | "hero" | "organize" | "pairs";

interface ProjectImage {
  id: string;
  url: string;
  tags: ImageTag[];
  caption?: string;
  pairId?: string; // Links to a pair if part of one
}

interface ImagePair {
  id: string;
  label: string;
  beforeImageId?: string;
  afterImageId?: string;
}

interface ProjectImagesManagerProps {
  images: ProjectImage[];
  pairs: ImagePair[];
  heroImageUrl?: string;
  onImagesChange: (images: ProjectImage[]) => void;
  onPairsChange: (pairs: ImagePair[]) => void;
  onHeroImageChange?: (url: string) => void;
  label?: string;
  description?: string;
  maxImages?: number;
  maxPairs?: number;
}

export function ProjectImagesManager({
  images,
  pairs,
  heroImageUrl,
  onImagesChange,
  onPairsChange,
  onHeroImageChange,
  label = "Project Images",
  description,
  maxImages = 50,
  maxPairs = 8
}: ProjectImagesManagerProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [imageSelectionModal, setImageSelectionModal] = useState<{ type: 'before' | 'after'; onSelect: (imageId: string) => void } | null>(null);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [draggedPair, setDraggedPair] = useState<string | null>(null);

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    
    const imageToRemove = images.find(img => img.id === imageToDelete);
    
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

    // Remove from images
    const newImages = images.filter(img => img.id !== imageToDelete);
    onImagesChange(newImages);

    // Remove from any pairs
    const newPairs = pairs.map(pair => ({
      ...pair,
      beforeImageId: pair.beforeImageId === imageToDelete ? undefined : pair.beforeImageId,
      afterImageId: pair.afterImageId === imageToDelete ? undefined : pair.afterImageId
    }));
    onPairsChange(newPairs);
    
    // Close the modal
    setImageToDelete(null);
  };

  // Step 2: Tag Images
  const toggleTag = (imageId: string, tag: ImageTag) => {
    const newImages = images.map(img => {
      if (img.id === imageId) {
        const hasTag = img.tags.includes(tag);
        
        if (hasTag) {
          // Remove the tag
          return {
            ...img,
            tags: img.tags.filter(t => t !== tag)
          };
        } else {
          // Add the tag, but handle mutual exclusivity for before/after
          let newTags = [...img.tags, tag];
          
          if (tag === "before") {
            // Remove "after" tag if adding "before"
            newTags = newTags.filter(t => t !== "after");
          } else if (tag === "after") {
            // Remove "before" tag if adding "after"
            newTags = newTags.filter(t => t !== "before");
          }
          
        return {
          ...img,
            tags: newTags
        };
        }
      }
      return img;
    });
    onImagesChange(newImages);
  };

  // Step 4: Create Pairs
  const createPair = (beforeImageId: string, afterImageId: string) => {
    if (pairs.length < maxPairs) {
      const newPair: ImagePair = {
        id: Date.now().toString(),
        label: `Before & After ${pairs.length + 1}`,
        beforeImageId,
        afterImageId
      };
      onPairsChange([...pairs, newPair]);
      setSelectedImages([]);
    }
  };

  const removePair = (pairId: string) => {
    const newPairs = pairs.filter(pair => pair.id !== pairId);
    // Renumber all pairs after deletion
    const renumberedPairs = newPairs.map((pair, index) => ({
      ...pair,
      label: `Before & After ${index + 1}`
    }));
    onPairsChange(renumberedPairs);
  };

  const updatePairLabel = (pairId: string, label: string) => {
    const newPairs = pairs.map(pair => {
      if (pair.id === pairId) {
        return { ...pair, label };
      }
      return pair;
    });
    onPairsChange(newPairs);
  };

  // Renumber all pairs to ensure sequential numbering
  const renumberAllPairs = () => {
    const renumberedPairs = pairs.map((pair, index) => ({
      ...pair,
      label: `Before & After ${index + 1}`
    }));
    onPairsChange(renumberedPairs);
  };

  const getImageById = (imageId: string) => images.find(img => img.id === imageId);
  const getTagColor = (tag: ImageTag) => {
    switch (tag) {
      case "before": return "bg-orange-50 text-orange-700 border-orange-200";
      case "after": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "gallery": return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImage(imageId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', imageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault();
    
    if (!draggedImage || draggedImage === targetImageId) {
      setDraggedImage(null);
      return;
    }

    const draggedIndex = images.findIndex(img => img.id === draggedImage);
    const targetIndex = images.findIndex(img => img.id === targetImageId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedImage(null);
      return;
    }

    // Create new array with reordered images
    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);
    
    onImagesChange(newImages);
    setDraggedImage(null);
  };

  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  // Pair drag and drop functions
  const handlePairDragStart = (e: React.DragEvent, pairId: string) => {
    setDraggedPair(pairId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', pairId);
  };

  const handlePairDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePairDrop = (e: React.DragEvent, targetPairId: string) => {
    e.preventDefault();
    
    if (!draggedPair || draggedPair === targetPairId) {
      setDraggedPair(null);
      return;
    }

    const draggedIndex = pairs.findIndex(pair => pair.id === draggedPair);
    const targetIndex = pairs.findIndex(pair => pair.id === targetPairId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedPair(null);
      return;
    }

    // Create new array with reordered pairs
    const newPairs = [...pairs];
    const [draggedItem] = newPairs.splice(draggedIndex, 1);
    newPairs.splice(targetIndex, 0, draggedItem);
    
    // Renumber all pairs after reordering
    const renumberedPairs = newPairs.map((pair, index) => ({
      ...pair,
      label: `Before & After ${index + 1}`
    }));
    
    onPairsChange(renumberedPairs);
    setDraggedPair(null);
  };

  const handlePairDragEnd = () => {
    setDraggedPair(null);
  };

  const beforeImages = images.filter(img => img.tags.includes("before"));
  const afterImages = images.filter(img => img.tags.includes("after"));
  const galleryImages = images.filter(img => img.tags.includes("gallery"));

  // Auto-renumber pairs when component loads to fix any existing numbering issues
  useEffect(() => {
    if (pairs.length > 0) {
      // Check if any pair has incorrect numbering
      const needsRenumbering = pairs.some((pair, index) => 
        pair.label !== `Before & After ${index + 1}`
      );
      
      if (needsRenumbering) {
        renumberAllPairs();
      }
    }
  }, []); // Only run on mount

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{label}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Workflow Steps */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep("upload");
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentStep === "upload"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              1. Add Image(s)
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep("hero");
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentStep === "hero"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              2. Select Hero
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep("organize");
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentStep === "organize"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              3. Tag & Organize
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep("pairs");
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentStep === "pairs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              4. Create Pairs
            </div>
          </button>
        </nav>
      </div>

      {/* Step 1: Add Images */}
      {currentStep === "upload" && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-900 mb-2">Upload Your Images</h4>
            <p className="text-sm text-blue-800">Add all your project images first. You can organize them in the next steps.</p>
          </div>

          {/* Multi-File Upload */}
          <MultiFileImageUpload
            images={images}
            onChange={onImagesChange}
            placeholder="Choose multiple images or drag and drop"
            maxImages={maxImages}
              maxSize={10}
              acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
            />

          {/* Continue Button */}
          {images.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep("hero");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Continue to Select Hero
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Hero Image */}
      {currentStep === "hero" && (
        <div className="space-y-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-yellow-900 mb-2">Select Hero Image</h4>
            <p className="text-sm text-yellow-800">Choose which image will be the main hero image displayed on project cards and detail pages.</p>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No images uploaded yet.</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                  setCurrentStep("upload");
                  }}
                className="text-blue-600 hover:text-blue-800 font-medium"
                >
                ← Go back to upload images
                </button>
            </div>
          ) : (
            <>
              {/* Image Summary - moved here */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Image Summary</h5>
                <div className="flex gap-6 text-sm text-gray-600">
                  <span className="font-medium">Total: <span className="font-normal">{images.length}/{maxImages}</span></span>
                  <span className="font-medium">Before: <span className="font-normal">{beforeImages.length}</span></span>
                  <span className="font-medium">After: <span className="font-normal">{afterImages.length}</span></span>
                  <span className="font-medium">Gallery: <span className="font-normal">{galleryImages.length}</span></span>
                  <span className="font-medium">Pairs: <span className="font-normal">{pairs.length}</span></span>
                </div>
            </div>

              {/* Hero Image Selection Grid */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Click an image to select it as your hero image:</p>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((image) => {
                    const isSelected = heroImageUrl === image.url;
                    return (
                      <div
                        key={image.id}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all group ${
                          isSelected
                            ? "border-yellow-500 ring-2 ring-yellow-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt="Project image"
                          fill
                          className="object-cover cursor-pointer"
                          onClick={() => {
                            if (onHeroImageChange) {
                              onHeroImageChange(image.url);
                            }
                          }}
                        />
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center pointer-events-none">
                            <div className="bg-yellow-500 rounded-full p-2">
                              <Star className="h-6 w-6 text-white fill-white" />
                            </div>
                          </div>
                        )}
                        
                        {/* Tags indicator */}
                        <div className="absolute top-1 left-1 flex gap-1">
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep("upload");
                  }}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Back to Upload
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentStep("organize");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Continue to Tag & Organize
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Tag & Organize */}
      {currentStep === "organize" && (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-green-900 mb-2">Tag & Organize Your Images</h4>
            <p className="text-sm text-green-800">Tag images as Before, After, or Gallery. Drag and drop to reorder images. Images can have multiple tags.</p>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No images uploaded yet.</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep("upload");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Go back to upload images
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div 
                  key={image.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, image.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, image.id)}
                  onDragEnd={handleDragEnd}
                  className={`relative aspect-square overflow-hidden rounded-lg border border-gray-200 group transition-all duration-200 ${
                    draggedImage === image.id 
                      ? 'opacity-50 scale-95 shadow-lg' 
                      : draggedImage && 'hover:border-blue-400'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded p-1 text-white cursor-move">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Order Number */}
                  <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>

                  <Image
                    src={image.url}
                    alt="Project image"
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => setPreviewImage(image)}
                  />
                  
                  {/* Active Tags */}
                  <div className="absolute top-2 left-12 flex gap-1">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-1 text-xs font-medium border ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImageToDelete(image.id);
                    }}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Delete image"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Tag Controls */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      {(["before", "after", "gallery"] as ImageTag[]).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleTag(image.id, tag);
                          }}
                          className={`rounded-full px-2 py-1 text-xs font-medium border transition-colors ${
                            image.tags.includes(tag)
                              ? getTagColor(tag)
                              : "bg-white/90 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                          title={
                            tag === "before" || tag === "after" 
                              ? `Click to ${image.tags.includes(tag) ? 'remove' : 'add'} ${tag} tag (mutually exclusive with ${tag === "before" ? "after" : "before"})`
                              : `Click to ${image.tags.includes(tag) ? 'remove' : 'add'} ${tag} tag`
                          }
                        >
                          {tag}
                          {image.tags.includes(tag) && <span className="ml-1">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep("upload");
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Upload
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep("pairs");
              }}
              className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Continue to Create Pairs →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Create Pairs */}
      {currentStep === "pairs" && (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-purple-900 mb-2">Create Before/After Pairs</h4>
            <p className="text-sm text-purple-800">Select before and after images to create side-by-side comparisons.</p>
          </div>

          {/* Create New Pair */}
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-gray-900">Create New Pair</h5>
              {pairs.length >= maxPairs && (
                <span className="text-xs text-amber-600 font-medium">
                  Maximum pairs reached ({maxPairs})
                </span>
              )}
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${pairs.length >= maxPairs ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Before Image Selection */}
                <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">Before Image</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors"
                  onClick={() => {
                    if (pairs.length < maxPairs) {
                      setImageSelectionModal({
                        type: 'before',
                        onSelect: (imageId) => {
                          setSelectedImages([imageId]);
                          setImageSelectionModal(null);
                        }
                      });
                    }
                  }}
                >
                  {selectedImages[0] ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={images.find(img => img.id === selectedImages[0])?.url || ''}
                        alt="Selected before image"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                            setSelectedImages([]);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Click to select before image</p>
                      <p className="text-xs text-gray-400 mt-1">{beforeImages.length} available</p>
                    </div>
                  )}
                  </div>
                </div>

              {/* After Image Selection */}
                <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">After Image</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors"
                  onClick={() => {
                    if (pairs.length < maxPairs && selectedImages.length > 0) {
                      setImageSelectionModal({
                        type: 'after',
                        onSelect: (imageId) => {
                          if (imageId !== selectedImages[0]) {
                            setSelectedImages([selectedImages[0], imageId]);
                          }
                          setImageSelectionModal(null);
                        }
                      });
                    }
                  }}
                >
                  {selectedImages[1] ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={images.find(img => img.id === selectedImages[1])?.url || ''}
                        alt="Selected after image"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImages(selectedImages.slice(0, 1));
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Click to select after image</p>
                      <p className="text-xs text-gray-400 mt-1">{afterImages.length} available</p>
                      {selectedImages.length === 0 && (
                        <p className="text-xs text-amber-500 mt-1">Select a before image first</p>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {selectedImages.length === 2 && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Pair label (e.g., Kitchen Renovation)"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={pairs.length >= maxPairs}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                    if (selectedImages.length === 2 && pairs.length < maxPairs) {
                        createPair(selectedImages[0], selectedImages[1]);
                      setSelectedImages([]);
                    }
                  }}
                  disabled={pairs.length >= maxPairs}
                  className={`rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors ${
                    pairs.length >= maxPairs
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  >
                    Create Pair
                  </button>
                </div>
              )}
            </div>

          {/* Existing Pairs */}
          {pairs.length > 0 && (
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-900">Created Pairs ({pairs.length})</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pairs.map((pair) => {
                  const beforeImage = getImageById(pair.beforeImageId || "");
                  const afterImage = getImageById(pair.afterImageId || "");
                  
                  return (
                    <div 
                      key={pair.id} 
                      draggable
                      onDragStart={(e) => handlePairDragStart(e, pair.id)}
                      onDragOver={handlePairDragOver}
                      onDrop={(e) => handlePairDrop(e, pair.id)}
                      onDragEnd={handlePairDragEnd}
                      className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 cursor-move ${
                        draggedPair === pair.id 
                          ? 'opacity-50 scale-95 shadow-lg' 
                          : draggedPair && 'hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={pair.label}
                          onChange={(e) => updatePairLabel(pair.id, e.target.value)}
                          className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removePair(pair.id);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                          {beforeImage ? (
                            <Image
                              src={beforeImage.url}
                              alt="Before"
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              No before image
                            </div>
                          )}
                        </div>
                        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                          {afterImage ? (
                            <Image
                              src={afterImage.url}
                              alt="After"
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                              No after image
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-start">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep("organize");
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Tag & Organize
            </button>
          </div>
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
                  alt={previewImage.caption || "Image preview"}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Image Details</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Caption:</span>
                    <p className="font-medium text-gray-900">{previewImage.caption || 'No caption'}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Tags:</span>
                    <div className="flex gap-1 mt-1">
                      {previewImage.tags.length > 0 ? (
                        previewImage.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2 py-1 text-xs font-medium border ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No tags</span>
                      )}
                    </div>
                  </div>
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
                      setImageToDelete(previewImage.id);
                      setPreviewImage(null);
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
      {imageToDelete && (
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

      {/* Image Selection Modal */}
      {imageSelectionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setImageSelectionModal(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full mx-4 bg-white rounded-lg overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Select {imageSelectionModal.type === 'before' ? 'Before' : 'After'} Image
              </h3>
              <button
                onClick={() => setImageSelectionModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {(imageSelectionModal.type === 'before' ? beforeImages : afterImages).map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {
                      // Don't allow selecting the same image for before/after
                      if (imageSelectionModal.type === 'after' && image.id === selectedImages[0]) {
                        return;
                      }
                      imageSelectionModal.onSelect(image.id);
                    }}
                    disabled={imageSelectionModal.type === 'after' && image.id === selectedImages[0]}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      imageSelectionModal.type === 'after' && image.id === selectedImages[0]
                        ? 'border-gray-300 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${imageSelectionModal.type} image`}
                      fill
                      className="object-cover"
                    />
                    {imageSelectionModal.type === 'after' && image.id === selectedImages[0] && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Already selected as before</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {(imageSelectionModal.type === 'before' ? beforeImages : afterImages).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No {imageSelectionModal.type} images available.</p>
                  <p className="text-sm mt-1">Tag some images as "{imageSelectionModal.type}" in the Tag & Organize step first.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
