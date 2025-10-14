/**
 * Cleanup Supabase Storage
 * Run with: npx tsx scripts/cleanup-storage.ts
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://bwddpoellslqtuyrioau.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZGRwb2VsbHNscXR1eXJpb2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1OTEwMSwiZXhwIjoyMDc1NDM1MTAxfQ.E-KPRHvJnULzP9zHh48Y-WssAeL7Pr4Xy1xR0nF4Stk'
);

async function cleanupStorage() {
  console.log('🗂️ Cleaning up Supabase Storage...');
  
  try {
    // List all files in the images bucket
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (listError) {
      console.error('❌ Error listing files:', listError);
      return;
    }
    
    if (!files || files.length === 0) {
      console.log('📁 No files found in storage - already clean!');
      return;
    }
    
    console.log(`📁 Found ${files.length} files to delete...`);
    
    // Delete all files
    const filePaths = files.map(file => file.name);
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove(filePaths);
    
    if (deleteError) {
      console.error('❌ Error deleting files:', deleteError);
    } else {
      console.log('✅ All files deleted from Supabase Storage');
    }
    
  } catch (error) {
    console.error('❌ Error during storage cleanup:', error);
  }
}

cleanupStorage();
