"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { MultiFileImageUpload } from "./multi-file-image-upload";
import { X, Plus, ArrowRight, Tag, Grid3X3, Link, Star } from "lucide-react";
import Image from "next/image";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

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
  onImagesChange: (images: ProjectImage[]) => void;
  onPairsChange: (pairs: ImagePair[]) => void;
  heroImageUrl?: string;
  onHeroImageChange?: (url: string) => void;
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
  heroImageUrl,
  onHeroImageChange,
  label = "Project Images",
  description,
  maxImages = 50,
  maxPairs = 10
}: ProjectImagesManagerProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [selectedPairImages, setSelectedPairImages] = useState<string[]>([]);
  const [pairLabel, setPairLabel] = useState("");
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [draggedPairIndex, setDraggedPairIndex] = useState<number | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'before' | 'after' | null>(null);

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    const imageToRemove = images.find(img => img.id === imageToDelete);
    if (!imageToRemove) {
      setImageToDelete(null);
      return;
    }

    try {
      // Delete from Supabase storage
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageToRemove.url
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(`Failed to delete image: ${result.error}`);
        setImageToDelete(null);
        return;
      }

      // Remove from images array
      const newImages = images.filter(img => img.id !== imageToDelete);
      onImagesChange(newImages);

      // Remove from any pairs
      const newPairs = pairs.map(pair => ({
        ...pair,
        beforeImageId: pair.beforeImageId === imageToDelete ? undefined : pair.beforeImageId,
        afterImageId: pair.afterImageId === imageToDelete ? undefined : pair.afterImageId
      }));
      onPairsChange(newPairs);
      
      setImageToDelete(null);

    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
      setImageToDelete(null);
    }
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
        label: pairLabel.trim() || `Pair ${pairs.length + 1}`,
        beforeImageId,
        afterImageId
      };
      onPairsChange([...pairs, newPair]);
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

  const handleDragStart = (index: number) => {
    setDraggedPairIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedPairIndex === null || draggedPairIndex === dropIndex) {
      setDraggedPairIndex(null);
      return;
    }

    const newPairs = [...pairs];
    const draggedPair = newPairs[draggedPairIndex];
    newPairs.splice(draggedPairIndex, 1);
    newPairs.splice(dropIndex, 0, draggedPair);
    
    onPairsChange(newPairs);
    setDraggedPairIndex(null);
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
              1. Add/Remove Images
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

      {/* Step 1: Add/Remove Images */}
      {currentStep === "upload" && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-900 mb-2">Add or Remove Images</h4>
            <p className="text-sm text-blue-800">Upload new images or select and delete existing ones. You can organize them in the next steps.</p>
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
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {heroImageUrl ? 'Selected hero image (click another to change):' : 'Click an image to select it as your hero image:'}
                  </p>
                  {heroImageUrl && (
                    <span className="text-sm text-green-600 font-medium">✓ Hero image selected</span>
                  )}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((image) => {
                    const isSelected = image.url === heroImageUrl;
                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (onHeroImageChange) {
                            onHeroImageChange(image.url);
                          }
                        }}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-green-500 ring-4 ring-green-100 shadow-lg' 
                            : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt="Project image"
                          fill
                          className="object-cover"
                        />
                        
                        {/* Hero badge */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <div className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                              ★ HERO
                            </div>
                          </div>
                        )}
                        
                        {/* Tags indicator */}
                        <div className="absolute top-1 right-1 flex gap-1">
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
                      </button>
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

      {/* Step 4: Create Pairs */}
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
              
              {/* Before/After Selection */}
              <div className="flex gap-4">
                {/* Before Image Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectingFor('before');
                    setShowImageSelector(true);
                  }}
                  className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📸</div>
                    <div className="text-sm font-medium text-gray-700">
                      {selectedPairImages[0] ? 'Before Selected' : 'Select Before Image'}
                    </div>
                    {selectedPairImages[0] && (
                      <div className="mt-2 text-xs text-orange-600">✓ Ready</div>
                    )}
                  </div>
                </button>

                {/* Arrow */}
                <div className="flex items-center">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>

                {/* After Image Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectingFor('after');
                    setShowImageSelector(true);
                  }}
                  className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📸</div>
                    <div className="text-sm font-medium text-gray-700">
                      {selectedPairImages[1] ? 'After Selected' : 'Select After Image'}
                    </div>
                    {selectedPairImages[1] && (
                      <div className="mt-2 text-xs text-green-600">✓ Ready</div>
                    )}
                  </div>
                </button>
              </div>

              {/* Create Pair Button */}
              {selectedPairImages.length === 2 && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">✓ Both images selected!</p>
                    <p className="text-xs text-blue-600">Enter a label and click "Create Pair" to save this comparison.</p>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={pairLabel}
                      onChange={(e) => setPairLabel(e.target.value)}
                      placeholder="Pair label (e.g., Kitchen Renovation)"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (selectedPairImages.length === 2) {
                          createPair(selectedPairImages[0], selectedPairImages[1]);
                          setSelectedPairImages([]);
                          setPairLabel("");
                        }
                      }}
                      className="rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                    >
                      Create Pair
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Existing Pairs */}
          {pairs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-900">Created Pairs ({pairs.length})</h5>
                <p className="text-xs text-gray-500">Drag to reorder</p>
              </div>
              <div className="space-y-2">
                {pairs.map((pair, index) => {
                  const beforeImage = getImageById(pair.beforeImageId || "");
                  const afterImage = getImageById(pair.afterImageId || "");
                  const isDragging = draggedPairIndex === index;
                  
                  return (
                    <div
                      key={pair.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex items-center gap-2 border border-gray-200 rounded-lg p-2 cursor-move transition-all ${
                        isDragging ? 'opacity-50 scale-95' : 'hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Drag handle */}
                      <div className="flex flex-col gap-0.5 text-gray-400 px-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                      </div>
                      
                      {/* Number */}
                      <span className="text-xs font-bold text-gray-500 w-6 flex-shrink-0">#{index + 1}</span>
                      
                      {/* Before Image */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <div className="w-full h-full overflow-hidden rounded-lg border border-gray-200">
                          {beforeImage ? (
                            <Image
                              src={beforeImage.url}
                              alt="Before"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100"></div>
                          )}
                        </div>
                        <span className="absolute top-1 left-1 text-[9px] font-medium bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded">
                          Before
                        </span>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      
                      {/* After Image */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <div className="w-full h-full overflow-hidden rounded-lg border border-gray-200">
                          {afterImage ? (
                            <Image
                              src={afterImage.url}
                              alt="After"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100"></div>
                          )}
                        </div>
                        <span className="absolute top-1 left-1 text-[9px] font-medium bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded">
                          After
                        </span>
                      </div>
                      
                      {/* Label input */}
                      <input
                        type="text"
                        value={pair.label}
                        onChange={(e) => updatePairLabel(pair.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-w-0 text-xs text-gray-900 bg-transparent border-none outline-none focus:bg-white rounded px-2 py-1"
                        placeholder={`Pair ${index + 1}`}
                      />
                      
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removePair(pair.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={imageToDelete !== null}
        onConfirm={confirmDelete}
        onCancel={() => setImageToDelete(null)}
      />

      {/* Image Selector Modal */}
      {showImageSelector && selectingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowImageSelector(false);
              setSelectingFor(null);
            }}
          />
          
          {/* Modal */}
          <div className="relative z-10 w-full max-w-4xl max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Select {selectingFor === 'before' ? 'Before' : 'After'} Image
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose an image tagged as "{selectingFor}" for your pair
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImageSelector(false);
                  setSelectingFor(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Image Grid */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(selectingFor === 'before' ? beforeImages : afterImages).map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {
                      if (selectingFor === 'before') {
                        setSelectedPairImages([image.id, selectedPairImages[1] || '']);
                      } else {
                        setSelectedPairImages([selectedPairImages[0] || '', image.id]);
                      }
                      setShowImageSelector(false);
                      setSelectingFor(null);
                    }}
                    className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <Image
                      src={image.url}
                      alt={`${selectingFor} image`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    
                    {/* Selection indicator */}
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors" />
                    
                    {/* Tag indicator */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        selectingFor === 'before' 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {selectingFor}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Empty state */}
              {(selectingFor === 'before' ? beforeImages : afterImages).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📷</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No {selectingFor} images found
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Tag some images as "{selectingFor}" in Step 3 first.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("organize")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Go to Step 3 →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
