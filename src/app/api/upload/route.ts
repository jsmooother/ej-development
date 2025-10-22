import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminOrEditor } from "@/lib/auth";
import sharp from "sharp";

export const dynamic = "force-dynamic";

// Initialize Supabase client for file uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for uploads
);

// Image optimization settings
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB max
const MAX_WIDTH = 1920; // Max width for web images
const MAX_HEIGHT = 1080; // Max height for web images
const QUALITY = 85; // JPEG quality (85% is good balance of quality/size)

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdminOrEditor();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images." 
      }, { status: 400 });
    }

    // Validate file size (5MB max before optimization)
    const maxSize = 5 * 1024 * 1024; // 5MB max before optimization
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File size must be less than 5MB. Please compress your image before uploading." 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    // Optimize image with Sharp
    let optimizedBuffer: Buffer;
    let optimizedSize: number;
    let optimizedDimensions: { width: number; height: number };

    try {
      const image = sharp(originalBuffer);
      const metadata = await image.metadata();
      
      // Get original dimensions
      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;
      
      // Calculate new dimensions (maintain aspect ratio)
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      
      if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
        const aspectRatio = originalWidth / originalHeight;
        if (originalWidth > originalHeight) {
          newWidth = MAX_WIDTH;
          newHeight = Math.round(MAX_WIDTH / aspectRatio);
        } else {
          newHeight = MAX_HEIGHT;
          newWidth = Math.round(MAX_HEIGHT * aspectRatio);
        }
      }
      
      // Optimize image
      optimizedBuffer = await image
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: QUALITY,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
      
      optimizedSize = optimizedBuffer.length;
      optimizedDimensions = { width: newWidth, height: newHeight };
      
      console.log(`📸 Image optimized: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}, ${(originalBuffer.length / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB`);
      
    } catch (optimizationError) {
      console.error("Image optimization failed:", optimizationError);
      // Fallback to original buffer if optimization fails
      optimizedBuffer = originalBuffer;
      optimizedSize = originalBuffer.length;
      optimizedDimensions = { width: 0, height: 0 };
    }

    // Check if optimized file is still too large
    if (optimizedSize > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `Optimized image is still too large (${(optimizedSize / 1024 / 1024).toFixed(1)}MB). Please use a smaller source image.` 
      }, { status: 400 });
    }

    // Generate unique filename with .jpg extension (since we convert to JPEG)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.jpg`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images") // Bucket name
      .upload(filePath, optimizedBuffer, {
        contentType: "image/jpeg", // Always JPEG after optimization
        cacheControl: "3600", // Cache for 1 hour
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ 
        error: "Failed to upload file" 
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    console.log('✅ File uploaded successfully:', {
      originalFilename: file.name,
      originalSize: `${(file.size / 1024).toFixed(2)}KB`,
      optimizedSize: `${(optimizedSize / 1024).toFixed(2)}KB`,
      dimensions: `${optimizedDimensions.width}x${optimizedDimensions.height}`,
      path: filePath,
      url: urlData.publicUrl
    });

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      size: optimizedSize,
      originalSize: file.size,
      type: "image/jpeg",
      dimensions: optimizedDimensions,
      optimization: {
        originalSize: file.size,
        optimizedSize: optimizedSize,
        savings: file.size - optimizedSize,
        savingsPercent: Math.round(((file.size - optimizedSize) / file.size) * 100)
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ 
      error: "Upload failed" 
    }, { status: 500 });
  }
}