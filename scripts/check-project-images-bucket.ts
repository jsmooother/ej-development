/**
 * Check project-images bucket specifically
 * Run with: npx tsx scripts/check-project-images-bucket.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectImagesBucket() {
  console.log('🔍 Checking project-images bucket specifically');
  console.log('===============================================\n');

  try {
    // Try to access project-images bucket
    const { data: files, error } = await supabase.storage
      .from('project-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      console.log(`❌ Error accessing project-images bucket: ${error.message}`);
      console.log('This bucket might not exist or have access issues.\n');
      
      // Let's also check if there are any other buckets we missed
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error(`❌ Error listing buckets: ${bucketsError.message}`);
        return;
      }
      
      console.log('Available buckets:');
      buckets?.forEach(bucket => {
        console.log(`  - ${bucket.name} (public: ${bucket.public})`);
      });
      
      return;
    }
    
    if (!files || files.length === 0) {
      console.log('📁 No files found in project-images bucket');
      return;
    }
    
    console.log(`📁 Found ${files.length} files in project-images bucket\n`);
    
    let totalSize = 0;
    const folderStats: Record<string, { count: number; size: number }> = {};
    
    for (const file of files) {
      const size = file.metadata?.size || 0;
      totalSize += size;
      
      // Determine folder
      let folder = 'root';
      if (file.name.includes('/')) {
        folder = file.name.split('/')[0];
      }
      
      if (!folderStats[folder]) {
        folderStats[folder] = { count: 0, size: 0 };
      }
      
      folderStats[folder].count++;
      folderStats[folder].size += size;
    }
    
    // Display folder analysis
    console.log('📊 Storage Analysis by Folder:');
    console.log('==============================\n');
    
    for (const [folder, stats] of Object.entries(folderStats)) {
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      const percentage = totalSize > 0 ? ((stats.size / totalSize) * 100).toFixed(1) : '0.0';
      
      console.log(`📁 ${folder}/`);
      console.log(`   Files: ${stats.count}`);
      console.log(`   Size: ${sizeMB} MB (${percentage}%)`);
      console.log('');
    }
    
    // Overall stats
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(3);
    
    console.log('📈 Overall Statistics:');
    console.log('======================');
    console.log(`Total files: ${files.length}`);
    console.log(`Total size: ${totalSizeMB} MB (${totalSizeGB} GB)`);
    console.log(`Usage: ${((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(1)}% of 1GB free tier`);
    
    // Show largest files
    const largestFiles = files
      .sort((a, b) => (b.metadata?.size || 0) - (a.metadata?.size || 0))
      .slice(0, 10);
    
    if (largestFiles.length > 0) {
      console.log('\n🔍 Largest files:');
      console.log('=================');
      largestFiles.forEach((file, index) => {
        const fileSizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
        console.log(`${index + 1}. ${file.name} (${fileSizeMB} MB)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProjectImagesBucket()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
