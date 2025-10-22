/**
 * Force refresh storage and check for hidden files
 * Run with: npx tsx scripts/force-refresh-storage.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceRefreshStorage() {
  console.log('🔄 Force Refreshing Storage Analysis');
  console.log('====================================\n');

  try {
    // First, let's try to get a fresh list of all buckets
    console.log('1. Checking all available buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error(`❌ Error listing buckets: ${bucketsError.message}`);
      return;
    }
    
    console.log(`Found ${buckets?.length || 0} buckets:`);
    buckets?.forEach(bucket => {
      console.log(`  - ${bucket.name} (public: ${bucket.public}, created: ${bucket.created_at})`);
    });
    console.log('');
    
    // Now let's check each bucket thoroughly
    for (const bucket of buckets || []) {
      console.log(`2. Analyzing bucket: ${bucket.name}`);
      console.log('='.repeat(40));
      
      try {
        // Try different approaches to list files
        const approaches = [
          { name: 'Standard list', options: { limit: 1000 } },
          { name: 'With metadata', options: { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } } },
          { name: 'No limit', options: { limit: 10000 } }
        ];
        
        for (const approach of approaches) {
          console.log(`\n   Trying ${approach.name}...`);
          
          const { data: files, error } = await supabase.storage
            .from(bucket.name)
            .list('', approach.options);
          
          if (error) {
            console.log(`   ❌ Error: ${error.message}`);
            continue;
          }
          
          if (!files || files.length === 0) {
            console.log(`   📁 No files found`);
            continue;
          }
          
          console.log(`   📁 Found ${files.length} files`);
          
          let totalSize = 0;
          let filesWithSize = 0;
          
          for (const file of files) {
            const size = file.metadata?.size || 0;
            if (size > 0) {
              totalSize += size;
              filesWithSize++;
            }
          }
          
          const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
          const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(3);
          
          console.log(`   📊 Total size: ${totalSizeMB} MB (${totalSizeGB} GB)`);
          console.log(`   📊 Files with size metadata: ${filesWithSize}/${files.length}`);
          
          // Show some file examples
          if (files.length > 0) {
            console.log(`   🔍 Sample files:`);
            files.slice(0, 5).forEach(file => {
              const sizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
              console.log(`      - ${file.name} (${sizeMB} MB)`);
            });
          }
          
          // If we found files with size, this is our best result
          if (filesWithSize > 0) {
            break;
          }
        }
        
        // Also try to check specific folders that might exist
        const commonFolders = ['projects', 'uploads', 'images', 'project-images'];
        for (const folder of commonFolders) {
          console.log(`\n   Checking folder: ${folder}/`);
          
          const { data: folderFiles, error: folderError } = await supabase.storage
            .from(bucket.name)
            .list(folder, { limit: 100 });
          
          if (folderError) {
            console.log(`   ❌ Error: ${folderError.message}`);
            continue;
          }
          
          if (!folderFiles || folderFiles.length === 0) {
            console.log(`   📁 No files in ${folder}/`);
            continue;
          }
          
          console.log(`   📁 Found ${folderFiles.length} files in ${folder}/`);
          
          let folderSize = 0;
          for (const file of folderFiles) {
            folderSize += file.metadata?.size || 0;
          }
          
          const folderSizeMB = (folderSize / (1024 * 1024)).toFixed(2);
          console.log(`   📊 Folder size: ${folderSizeMB} MB`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error analyzing bucket ${bucket.name}: ${error}`);
      }
      
      console.log('');
    }
    
    // Final summary
    console.log('3. Summary');
    console.log('==========');
    console.log('If the dashboard shows 2.693 GB but API shows 0 MB, this could be:');
    console.log('- Dashboard caching issue (try refreshing the dashboard)');
    console.log('- Files in a different bucket not accessible via API');
    console.log('- Files with corrupted metadata');
    console.log('- Dashboard showing stale data');
    console.log('\nRecommendation: Check the Supabase dashboard directly and refresh it.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

forceRefreshStorage()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
