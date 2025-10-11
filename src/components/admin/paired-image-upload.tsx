"use client";

import { useState } from "react";
import { ImageUpload } from "./image-upload";
import { X, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";

interface PairedImage {
  id: string;
  beforeUrl?: string;
  afterUrl?: string;
  label?: string;
  caption?: string;
}

interface PairedImageUploadProps {
  pairs: PairedImage[];
  onChange: (pairs: PairedImage[]) => void;
  label?: string;
  description?: string;
  maxPairs?: number;
}

export function PairedImageUpload({
  pairs,
  onChange,
  label = "Before & After Pairs",
  description,
  maxPairs = 10
}: PairedImageUploadProps) {
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<"before" | "after" | null>(null);

  const addPair = () => {
    if (pairs.length < maxPairs) {
      const newPair: PairedImage = {
        id: Date.now().toString(),
        label: `Pair ${pairs.length + 1}`
      };
      onChange([...pairs, newPair]);
    }
  };

  const removePair = (pairId: string) => {
    const newPairs = pairs.filter(pair => pair.id !== pairId);
    onChange(newPairs);
  };

  const updatePairImage = (pairId: string, side: "before" | "after", url: string) => {
    const newPairs = pairs.map(pair => {
      if (pair.id === pairId) {
        return { ...pair, [side === "before" ? "beforeUrl" : "afterUrl"]: url };
      }
      return pair;
    });
    onChange(newPairs);
  };

  const updatePairLabel = (pairId: string, label: string) => {
    const newPairs = pairs.map(pair => {
      if (pair.id === pairId) {
        return { ...pair, label };
      }
      return pair;
    });
    onChange(newPairs);
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedPairId && selectedSide) {
      e.preventDefault();
      updatePairImage(selectedPairId, selectedSide, urlInput);
      setUrlInput("");
      setIsAddingUrl(false);
      setSelectedPairId(null);
      setSelectedSide(null);
    }
  };

  const openUrlInput = (pairId: string, side: "before" | "after") => {
    setSelectedPairId(pairId);
    setSelectedSide(side);
    setIsAddingUrl(true);
  };

  const getImageCount = () => {
    return pairs.reduce((count, pair) => {
      return count + (pair.beforeUrl ? 1 : 0) + (pair.afterUrl ? 1 : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
        <div className="mt-3 flex gap-6 text-sm text-gray-600">
          <span className="font-medium">Pairs: <span className="font-normal">{pairs.length}</span></span>
          <span className="font-medium">Images: <span className="font-normal">{getImageCount()}</span></span>
          <span className="font-medium text-gray-500">Max: {maxPairs} pairs</span>
        </div>
      </div>

      {/* Add New Pair */}
      {pairs.length < maxPairs && (
        <div className="space-y-3">
          <button
            onClick={addPair}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Before/After Pair
          </button>
        </div>
      )}

      {/* URL Input Modal */}
      {isAddingUrl && selectedPairId && selectedSide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Add {selectedSide === "before" ? "Before" : "After"} Image URL
            </h4>
            <div className="space-y-4">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleUrlKeyPress}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setUrlInput("");
                    setIsAddingUrl(false);
                    setSelectedPairId(null);
                    setSelectedSide(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (urlInput.trim() && selectedPairId && selectedSide) {
                      updatePairImage(selectedPairId, selectedSide, urlInput);
                      setUrlInput("");
                      setIsAddingUrl(false);
                      setSelectedPairId(null);
                      setSelectedSide(null);
                    }
                  }}
                  disabled={!urlInput.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pairs Grid */}
      {pairs.length > 0 && (
        <div className="space-y-6">
          {pairs.map((pair, index) => (
            <div key={pair.id} className="border border-gray-200 rounded-lg p-6 bg-white">
              {/* Pair Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={pair.label || `Pair ${index + 1}`}
                    onChange={(e) => updatePairLabel(pair.id, e.target.value)}
                    className="text-lg font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
                    placeholder="Pair label"
                  />
                </div>
                <button
                  onClick={() => removePair(pair.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Before/After Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before Image */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-900">Before</h5>
                  <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {pair.beforeUrl ? (
                      <div className="relative w-full h-full group">
                        <Image
                          src={pair.beforeUrl}
                          alt="Before image"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={() => openUrlInput(pair.id, "before")}
                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
                          >
                            Change Image
                          </button>
                        </div>
                        <button
                          onClick={() => updatePairImage(pair.id, "before", "")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Plus className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium mb-2">No before image</p>
                          <button
                            onClick={() => openUrlInput(pair.id, "before")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Add image URL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-gray-400" />
                </div>

                {/* After Image */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-900">After</h5>
                  <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {pair.afterUrl ? (
                      <div className="relative w-full h-full group">
                        <Image
                          src={pair.afterUrl}
                          alt="After image"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={() => openUrlInput(pair.id, "after")}
                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
                          >
                            Change Image
                          </button>
                        </div>
                        <button
                          onClick={() => updatePairImage(pair.id, "after", "")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Plus className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium mb-2">No after image</p>
                          <button
                            onClick={() => openUrlInput(pair.id, "after")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Add image URL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* File Upload for Both Images */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Upload Before Image</label>
                    <ImageUpload
                      value={pair.beforeUrl || ""}
                      onChange={(url) => updatePairImage(pair.id, "before", url)}
                      placeholder="Choose before image"
                      className="w-full"
                      maxSize={10}
                      acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Upload After Image</label>
                    <ImageUpload
                      value={pair.afterUrl || ""}
                      onChange={(url) => updatePairImage(pair.id, "after", url)}
                      placeholder="Choose after image"
                      className="w-full"
                      maxSize={10}
                      acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {pairs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 text-center bg-gray-50">
          <div className="mb-4 text-gray-400">
            <ArrowRight className="mx-auto h-12 w-12" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">No before/after pairs yet</p>
          <p className="text-sm text-gray-600 mb-4">Create pairs to show side-by-side comparisons</p>
          <button
            onClick={addPair}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create First Pair
          </button>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to create before/after pairs:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Add Before/After Pair" to create a new comparison</li>
          <li>• Upload or add URL for both before and after images of the same view</li>
          <li>• Label each pair (e.g., "Kitchen Renovation", "Living Room")</li>
          <li>• Images will display side-by-side on the frontend</li>
          <li>• You can have multiple pairs showing different views/rooms</li>
        </ul>
      </div>
    </div>
  );
}
