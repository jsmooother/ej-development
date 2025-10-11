"use client";

import React, { useState } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  quality = 85,
  placeholder = "blur",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate WebP URL if it's a Supabase image
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a Supabase URL, add WebP transformation
    if (originalSrc.includes('supabase') && originalSrc.includes('/storage/v1/object/public/')) {
      // Supabase Storage URLs can be optimized by adding query parameters
      const url = new URL(originalSrc);
      url.searchParams.set('format', 'webp');
      url.searchParams.set('quality', quality.toString());
      return url.toString();
    }
    
    // For Unsplash images, we can add WebP format
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }
    
    // For other images, return as-is
    return originalSrc;
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Generate a simple blur placeholder (static SVG-based)
  const generateBlurDataURL = () => {
    // Simple gray SVG as placeholder - works in SSR
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3C/svg%3E";
  };

  const optimizedSrc = getOptimizedSrc(src);
  const defaultBlurDataURL = blurDataURL || (placeholder === "blur" ? generateBlurDataURL() : undefined);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
      >
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs">Failed to load image</p>
        </div>
      </div>
    );
  }

  // Build image props conditionally
  const imageProps: any = {
    src: optimizedSrc,
    alt,
    className: `transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    }`,
    priority,
    sizes,
    quality,
    onLoad: handleLoad,
    onError: handleError,
  };

  // Add width/height or fill
  if (fill) {
    imageProps.fill = true;
  } else {
    imageProps.width = width;
    imageProps.height = height;
  }

  // Add placeholder only if blur is specified
  if (placeholder === "blur" && defaultBlurDataURL) {
    imageProps.placeholder = "blur";
    imageProps.blurDataURL = defaultBlurDataURL;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image {...imageProps} />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

// Hook for intersection observer-based lazy loading
export function useLazyLoad(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}
