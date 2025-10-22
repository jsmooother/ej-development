/**
 * Verify Storage vs Dashboard - Check for API vs Dashboard Discrepancy
 * Run with: npx tsx scripts/verify-storage-vs-dashboard.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyStorageVsDashboard() {
  console.log('🔍 Verifying Storage vs Dashboard - API vs Dashboard Discrepancy');
  console.log('================================================================\n');

  try {
    console.log('📊 Dashboard shows: 2.693 GB (269% of 1GB quota)');
    console.log('📊 API shows: 0.00 MB (0% of quota)');
    console.log('📊 Previous analysis showed: 55.84 MB (324 files)');
    console.log('');
    
    console.log('🔍 Possible causes for discrepancy:');
    console.log('1. Dashboard caching issue');
    console.log('2. API not returning file metadata');
    console.log('3. Files in different bucket or location');
    console.log('4. Dashboard showing stale data');
    console.log('5. Files with corrupted metadata');
    console.log('');
    
    // Try different approaches to get file information
    console.log('🧪 Testing different API approaches...\n');
    
    // Approach 1: List with different options
    console.log('1. Standard list with metadata:');
    const { data: files1, error: error1 } = await supabase.storage
      .from('images')
      .list('', { 
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error1) {
      console.log(`   ❌ Error: ${error1.message}`);
    } else {
      console.log(`   📁 Found ${files1?.length || 0} files`);
      if (files1 && files1.length > 0) {
        let totalSize = 0;
        files1.forEach(file => {
          totalSize += file.metadata?.size || 0;
        });
        console.log(`   📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   📊 Files with metadata: ${files1.filter(f => f.metadata?.size).length}/${files1.length}`);
      }
    }
    
    // Approach 2: List without metadata
    console.log('\n2. List without metadata:');
    const { data: files2, error: error2 } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });
    
    if (error2) {
      console.log(`   ❌ Error: ${error2.message}`);
    } else {
      console.log(`   📁 Found ${files2?.length || 0} files`);
      if (files2 && files2.length > 0) {
        files2.slice(0, 5).forEach(file => {
          console.log(`   - ${file.name} (${file.metadata?.size || 'no size'} bytes)`);
        });
      }
    }
    
    // Approach 3: Check specific project folders
    console.log('\n3. Checking specific project folders:');
    const projectFolders = ['projects/classic-pearl', 'projects/grand-celeste', 'projects/no1-o-stermalm', 'projects/the-nest', 'projects/wallin-revival'];
    
    let totalProjectFiles = 0;
    let totalProjectSize = 0;
    
    for (const folder of projectFolders) {
      try {
        const { data: folderFiles, error: folderError } = await supabase.storage
          .from('images')
          .list(folder, { limit: 1000 });
        
        if (folderError) {
          console.log(`   ❌ ${folder}: ${folderError.message}`);
        } else if (!folderFiles || folderFiles.length === 0) {
          console.log(`   📁 ${folder}: No files`);
        } else {
          let folderSize = 0;
          folderFiles.forEach(file => {
            folderSize += file.metadata?.size || 0;
          });
          
          totalProjectFiles += folderFiles.length;
          totalProjectSize += folderSize;
          
          const folderSizeMB = (folderSize / 1024 / 1024).toFixed(2);
          console.log(`   📁 ${folder}: ${folderFiles.length} files, ${folderSizeMB} MB`);
        }
      } catch (error) {
        console.log(`   ❌ ${folder}: Error - ${error}`);
      }
    }
    
    console.log(`\n   📊 Project folders total: ${totalProjectFiles} files, ${(totalProjectSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Approach 4: Try to get file info directly
    console.log('\n4. Testing direct file access:');
    try {
      // Try to get info about a file we know exists
      const { data: fileInfo, error: fileError } = await supabase.storage
        .from('images')
        .list('projects/classic-pearl', { limit: 1 });
      
      if (fileError) {
        console.log(`   ❌ Error accessing project files: ${fileError.message}`);
      } else if (fileInfo && fileInfo.length > 0) {
        const file = fileInfo[0];
        console.log(`   📄 Sample file: ${file.name}`);
        console.log(`   📊 Size: ${file.metadata?.size || 'no metadata'} bytes`);
        console.log(`   📊 Created: ${file.created_at || 'no date'}`);
        console.log(`   📊 Updated: ${file.updated_at || 'no date'}`);
      } else {
        console.log(`   📁 No files found in projects/classic-pearl`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
    
    // Summary and recommendations
    console.log('\n📈 Analysis Summary:');
    console.log('====================');
    console.log(`API shows: ${totalProjectFiles} files, ${(totalProjectSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Dashboard shows: 2.693 GB`);
    console.log(`Previous analysis: 324 files, 55.84 MB`);
    
    if (totalProjectSize === 0) {
      console.log('\n⚠️  ISSUE DETECTED: API is not returning file sizes!');
      console.log('   This could be due to:');
      console.log('   - Supabase API issue');
      console.log('   - File metadata corruption');
      console.log('   - Permission issues');
      console.log('   - Dashboard showing cached/stale data');
      
      console.log('\n💡 Recommendations:');
      console.log('1. Check Supabase dashboard directly and refresh it');
      console.log('2. Wait a few minutes for dashboard to update');
      console.log('3. Check if there are files in other buckets');
      console.log('4. Contact Supabase support if issue persists');
      
    } else if (totalProjectSize < 100 * 1024 * 1024) { // Less than 100MB
      console.log('\n✅ API shows reasonable storage usage');
      console.log('   Dashboard might be showing stale data');
      console.log('   Try refreshing the dashboard');
      
    } else {
      console.log('\n⚠️  API shows significant storage usage');
      console.log('   This matches the dashboard reading');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

verifyStorageVsDashboard()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
