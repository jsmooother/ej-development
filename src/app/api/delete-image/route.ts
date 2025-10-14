import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Extract the path from the URL
    // URL format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) {
      return NextResponse.json(
        { success: false, error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    const [bucket, ...pathParts] = urlParts[1].split('/');
    const path = pathParts.join('/');

    if (!bucket || !path) {
      return NextResponse.json(
        { success: false, error: "Could not extract bucket and path from URL" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Delete the file from storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error("Storage deletion error:", error);
      return NextResponse.json(
        { success: false, error: `Failed to delete from storage: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete image" 
      },
      { status: 500 }
    );
  }
}

