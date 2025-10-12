"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { MultiFileImageUpload } from "./multi-file-image-upload";
import { X, Plus, ArrowRight, Tag, Grid3X3, Link } from "lucide-react";
import Image from "next/image";

type ImageTag = "before" | "after" | "gallery";
type WorkflowStep = "upload" | "organize" | "pairs";

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
  onImagesChange: (images: ProjectImage[]) => void;
  onPairsChange: (pairs: ImagePair[]) => void;
  label?: string;
  description?: string;
  maxImages?: number;
  maxPairs?: number;
}

export function ProjectImagesManager({
  images,
  pairs,
  onImagesChange,
  onPairsChange,
  label = "Project Images",
  description,
  maxImages = 30,
  maxPairs = 10
}: ProjectImagesManagerProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const removeImage = (imageId: string) => {
    // Remove from images
    const newImages = images.filter(img => img.id !== imageId);
    onImagesChange(newImages);

    // Remove from any pairs
    const newPairs = pairs.map(pair => ({
      ...pair,
      beforeImageId: pair.beforeImageId === imageId ? undefined : pair.beforeImageId,
      afterImageId: pair.afterImageId === imageId ? undefined : pair.afterImageId
    }));
    onPairsChange(newPairs);
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

  // Step 3: Create Pairs
  const createPair = (beforeImageId: string, afterImageId: string) => {
    if (pairs.length < maxPairs) {
      const newPair: ImagePair = {
        id: Date.now().toString(),
        label: `Pair ${pairs.length + 1}`,
        beforeImageId,
        afterImageId
      };
      onPairsChange([...pairs, newPair]);
      setSelectedImages([]);
    }
  };

  const removePair = (pairId: string) => {
    const newPairs = pairs.filter(pair => pair.id !== pairId);
    onPairsChange(newPairs);
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

  const getImageById = (imageId: string) => images.find(img => img.id === imageId);
  const getTagColor = (tag: ImageTag) => {
    switch (tag) {
      case "before": return "bg-orange-50 text-orange-700 border-orange-200";
      case "after": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "gallery": return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const beforeImages = images.filter(img => img.tags.includes("before"));
  const afterImages = images.filter(img => img.tags.includes("after"));
  const galleryImages = images.filter(img => img.tags.includes("gallery"));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{label}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span className="font-medium">Before: <span className="font-normal">{beforeImages.length}</span></span>
          <span className="font-medium">After: <span className="font-normal">{afterImages.length}</span></span>
          <span className="font-medium">Gallery: <span className="font-normal">{galleryImages.length}</span></span>
          <span className="font-medium">Pairs: <span className="font-normal">{pairs.length}</span></span>
          <span className="font-medium text-gray-500">Total: {images.length}/{maxImages}</span>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
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
              1. Upload Images
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
              2. Tag & Organize
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
              3. Create Pairs
            </div>
          </button>
        </nav>
      </div>

      {/* Step 1: Upload Images */}
      {currentStep === "upload" && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-900 mb-2">Upload Your Images</h4>
            <p className="text-sm text-blue-800">Add all your project images first. You can organize them in the next steps.</p>
          </div>

          {/* Multi-File Upload */}
          <MultiFileImageUpload
            images={images}
            onChange={setImages}
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
                  setCurrentStep("organize");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Continue to Tag & Organize
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Tag & Organize */}
      {currentStep === "organize" && (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-green-900 mb-2">Tag Your Images</h4>
            <p className="text-sm text-green-800">Tag images as Before, After, or Gallery. Images can have multiple tags.</p>
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
              {images.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 group">
                  <Image
                    src={image.url}
                    alt="Project image"
                    fill
                    className="object-cover"
                  />
                  
                  {/* Active Tags */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-1 text-xs font-medium border ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Tag Controls */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      {(["before", "after", "gallery"] as ImageTag[]).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
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

      {/* Step 3: Create Pairs */}
      {currentStep === "pairs" && (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-purple-900 mb-2">Create Before/After Pairs</h4>
            <p className="text-sm text-purple-800">Select before and after images to create side-by-side comparisons.</p>
          </div>

          {/* Create New Pair */}
          {pairs.length < maxPairs && (
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-900">Create New Pair</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before Images */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">Select Before Image</label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {beforeImages.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (selectedImages.length === 0) {
                            setSelectedImages([image.id]);
                          } else if (selectedImages[0] === image.id) {
                            setSelectedImages([]);
                          }
                        }}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                          selectedImages.includes(image.id)
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt="Before image"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* After Images */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">Select After Image</label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {afterImages.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (selectedImages.length === 1) {
                            setSelectedImages([selectedImages[0], image.id]);
                          } else if (selectedImages[1] === image.id) {
                            setSelectedImages([selectedImages[0]]);
                          }
                        }}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                          selectedImages.includes(image.id)
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt="After image"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedImages.length === 2 && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Pair label (e.g., Kitchen Renovation)"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (selectedImages.length === 2) {
                        createPair(selectedImages[0], selectedImages[1]);
                      }
                    }}
                    className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Create Pair
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Existing Pairs */}
          {pairs.length > 0 && (
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-900">Created Pairs ({pairs.length})</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pairs.map((pair) => {
                  const beforeImage = getImageById(pair.beforeImageId || "");
                  const afterImage = getImageById(pair.afterImageId || "");
                  
                  return (
                    <div key={pair.id} className="border border-gray-200 rounded-lg p-4">
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

          <div className="flex justify-between">
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
            <div className="text-sm text-gray-500">
              Workflow complete! Your images are organized.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
