/**
 * Analyze Supabase Storage Usage
 * Run with: npx tsx scripts/analyze-storage-usage.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeStorageUsage() {
  console.log('🔍 Analyzing Supabase Storage Usage');
  console.log('=====================================\n');

  try {
    // List all files in the images bucket
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    
    if (!files || files.length === 0) {
      console.log('📁 No files found in storage');
      return;
    }
    
    console.log(`📁 Found ${files.length} files in storage\n`);
    
    // Analyze by folder structure
    const folderStats: Record<string, { count: number; size: number; files: any[] }> = {};
    let totalSize = 0;
    
    for (const file of files) {
      const size = file.metadata?.size || 0;
      totalSize += size;
      
      // Determine folder
      let folder = 'root';
      if (file.name.includes('/')) {
        folder = file.name.split('/')[0];
      }
      
      if (!folderStats[folder]) {
        folderStats[folder] = { count: 0, size: 0, files: [] };
      }
      
      folderStats[folder].count++;
      folderStats[folder].size += size;
      folderStats[folder].files.push(file);
    }
    
    // Display folder analysis
    console.log('📊 Storage Analysis by Folder:');
    console.log('==============================\n');
    
    for (const [folder, stats] of Object.entries(folderStats)) {
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      const percentage = ((stats.size / totalSize) * 100).toFixed(1);
      
      console.log(`📁 ${folder}/`);
      console.log(`   Files: ${stats.count}`);
      console.log(`   Size: ${sizeMB} MB (${percentage}%)`);
      
      // Show largest files in this folder
      const largestFiles = stats.files
        .sort((a, b) => (b.metadata?.size || 0) - (a.metadata?.size || 0))
        .slice(0, 3);
      
      if (largestFiles.length > 0) {
        console.log(`   Largest files:`);
        largestFiles.forEach(file => {
          const fileSizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
          console.log(`     - ${file.name} (${fileSizeMB} MB)`);
        });
      }
      console.log('');
    }
    
    // Overall stats
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const freeTierLimitMB = 1024; // 1GB
    const usagePercentage = ((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(1);
    
    console.log('📈 Overall Statistics:');
    console.log('======================');
    console.log(`Total files: ${files.length}`);
    console.log(`Total size: ${totalSizeMB} MB`);
    console.log(`Usage: ${usagePercentage}% of 1GB free tier`);
    console.log(`Remaining: ${(freeTierLimitMB - parseFloat(totalSizeMB)).toFixed(2)} MB`);
    
    // Check for potential duplicates
    console.log('\n🔍 Duplicate Analysis:');
    console.log('======================');
    
    const fileGroups: Record<string, any[]> = {};
    
    for (const file of files) {
      // Group by filename without timestamp/random suffix
      const baseName = file.name.replace(/^\d+-[a-z0-9]+-/, '').replace(/^[^/]+\//, '');
      if (!fileGroups[baseName]) {
        fileGroups[baseName] = [];
      }
      fileGroups[baseName].push(file);
    }
    
    const duplicates = Object.entries(fileGroups).filter(([_, files]) => files.length > 1);
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} potential duplicate groups:`);
      duplicates.slice(0, 5).forEach(([baseName, files]) => {
        console.log(`  - ${baseName}: ${files.length} copies`);
        files.forEach(file => {
          const sizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
          console.log(`    * ${file.name} (${sizeMB} MB)`);
        });
      });
      
      if (duplicates.length > 5) {
        console.log(`  ... and ${duplicates.length - 5} more duplicate groups`);
      }
    } else {
      console.log('No obvious duplicates found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeStorageUsage()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
