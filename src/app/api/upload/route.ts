import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminOrEditor } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Initialize Supabase client for file uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for uploads
);

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

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File size must be less than 10MB" 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = `${folder}/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images") // Bucket name
      .upload(filePath, buffer, {
        contentType: file.type,
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
      filename: file.name,
      path: filePath,
      size: `${(file.size / 1024).toFixed(2)}KB`,
      url: urlData.publicUrl
    });

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      size: file.size,
      type: file.type
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