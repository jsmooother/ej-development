import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminOrEditor } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Check authentication
    await requireAdminOrEditor();

    // Get all files from the images bucket
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', {
        limit: 1000, // Adjust based on your needs
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error listing files:', error);
      return NextResponse.json({ error: 'Failed to fetch storage stats' }, { status: 500 });
    }

    // Calculate stats
    let totalSize = 0;
    const filesByType: Record<string, { count: number; size: number }> = {};

    for (const file of files) {
      totalSize += file.metadata?.size || 0;
      
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      if (!filesByType[extension]) {
        filesByType[extension] = { count: 0, size: 0 };
      }
      filesByType[extension].count++;
      filesByType[extension].size += file.metadata?.size || 0;
    }

    const totalSizeMB = totalSize / (1024 * 1024);
    const freeTierLimitMB = 1024; // 1GB
    const usagePercentage = (totalSizeMB / freeTierLimitMB) * 100;

    const stats = {
      totalFiles: files.length,
      totalSize,
      totalSizeMB: Math.round(totalSizeMB * 100) / 100,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      filesByType,
      freeTierLimitMB,
      remainingMB: Math.max(0, freeTierLimitMB - totalSizeMB)
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Storage stats error:', error);
    
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch storage stats' }, { status: 500 });
  }
}
