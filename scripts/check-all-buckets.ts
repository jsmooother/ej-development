/**
 * Check All Supabase Storage Buckets
 * Run with: npx tsx scripts/check-all-buckets.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllBuckets() {
  console.log('🔍 Checking All Supabase Storage Buckets');
  console.log('=========================================\n');

  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error(`❌ Error listing buckets: ${bucketsError.message}`);
      return;
    }
    
    if (!buckets || buckets.length === 0) {
      console.log('📁 No buckets found');
      return;
    }
    
    console.log(`📁 Found ${buckets.length} buckets:\n`);
    
    let totalFiles = 0;
    let totalSize = 0;
    
    for (const bucket of buckets) {
      console.log(`🪣 Bucket: ${bucket.name}`);
      console.log(`   Public: ${bucket.public ? 'Yes' : 'No'}`);
      console.log(`   Created: ${bucket.created_at}`);
      
      try {
        // List files in this bucket
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', {
            limit: 1000,
            sortBy: { column: 'created_at', order: 'desc' }
          });
        
        if (filesError) {
          console.log(`   ❌ Error listing files: ${filesError.message}`);
          continue;
        }
        
        if (!files || files.length === 0) {
          console.log(`   📁 No files found`);
          continue;
        }
        
        let bucketSize = 0;
        const folderStats: Record<string, { count: number; size: number }> = {};
        
        for (const file of files) {
          const size = file.metadata?.size || 0;
          bucketSize += size;
          
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
        
        const bucketSizeMB = (bucketSize / (1024 * 1024)).toFixed(2);
        console.log(`   📊 Files: ${files.length}`);
        console.log(`   📊 Size: ${bucketSizeMB} MB`);
        
        // Show folder breakdown
        if (Object.keys(folderStats).length > 1) {
          console.log(`   📁 Folders:`);
          for (const [folder, stats] of Object.entries(folderStats)) {
            const folderSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`      - ${folder}/: ${stats.count} files, ${folderSizeMB} MB`);
          }
        }
        
        // Show largest files
        const largestFiles = files
          .sort((a, b) => (b.metadata?.size || 0) - (a.metadata?.size || 0))
          .slice(0, 3);
        
        if (largestFiles.length > 0) {
          console.log(`   🔍 Largest files:`);
          largestFiles.forEach(file => {
            const fileSizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
            console.log(`      - ${file.name} (${fileSizeMB} MB)`);
          });
        }
        
        totalFiles += files.length;
        totalSize += bucketSize;
        
      } catch (error) {
        console.log(`   ❌ Error accessing bucket: ${error}`);
      }
      
      console.log('');
    }
    
    // Overall summary
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(3);
    
    console.log('📈 Overall Summary:');
    console.log('==================');
    console.log(`Total buckets: ${buckets.length}`);
    console.log(`Total files: ${totalFiles}`);
    console.log(`Total size: ${totalSizeMB} MB (${totalSizeGB} GB)`);
    console.log(`Free tier usage: ${((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(1)}% of 1GB`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllBuckets()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
