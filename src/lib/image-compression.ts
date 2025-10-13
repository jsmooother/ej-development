/**
 * Client-side image compression utilities
 * Helps reduce file sizes before upload to stay within free tier limits
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'jpeg' | 'webp' | 'png';
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }

          // Create new file with compressed data
          const compressedFile = new File([blob], file.name, {
            type: `image/${format}`,
            lastModified: Date.now()
          });

          console.log(`📦 Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`);
          resolve(compressedFile);
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export async function createThumbnail(
  file: File,
  size: number = 300
): Promise<File> {
  return compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    format: 'jpeg'
  });
}

export function getOptimalCompressionSettings(useCase: 'hero' | 'gallery' | 'thumbnail'): CompressionOptions {
  switch (useCase) {
    case 'hero':
      return { maxWidth: 1920, maxHeight: 1080, quality: 0.85, format: 'jpeg' };
    case 'gallery':
      return { maxWidth: 1200, maxHeight: 800, quality: 0.8, format: 'jpeg' };
    case 'thumbnail':
      return { maxWidth: 400, maxHeight: 400, quality: 0.7, format: 'jpeg' };
    default:
      return { maxWidth: 1200, maxHeight: 800, quality: 0.8, format: 'jpeg' };
  }
}
