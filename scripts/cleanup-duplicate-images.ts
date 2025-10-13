import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Keep these folders (correct structure)
const FOLDERS_TO_KEEP = [
  'projects/classic-pearl',
  'projects/grand-celeste',
  'projects/no1-o-stermalm',
  'projects/the-nest',
  'projects/wallin-revival'
];

// Delete these folders (duplicates/wrong structure)
const FOLDERS_TO_DELETE = [
  'projects/project---classic-pearl',
  'projects/project---grand-celeste',
  'projects/project---no1-ostermalm',
  'projects/project---the-nest',
  'projects/project---wallin-revival',
  'projects/project-folder',
  'all-images',
  'classic-pearl',
  'grand-celeste',
  'no1-o-stermalm',
  'the-nest',
  'uploads',
  'wallin-revival'
];

async function deleteFolder(folderPath: string) {
  console.log(`\n🗑️  Deleting: ${folderPath}`);
  
  try {
    // List all files in the folder
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list(folderPath, { limit: 1000 });
    
    if (listError) {
      console.error(`   ❌ Error listing files: ${listError.message}`);
      return 0;
    }
    
    if (!files || files.length === 0) {
      console.log(`   ℹ️  Folder is empty or doesn't exist`);
      return 0;
    }
    
    // Delete all files
    const filePaths = files
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => `${folderPath}/${f.name}`);
    
    if (filePaths.length === 0) {
      console.log(`   ℹ️  No files to delete`);
      return 0;
    }
    
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove(filePaths);
    
    if (deleteError) {
      console.error(`   ❌ Error deleting files: ${deleteError.message}`);
      return 0;
    }
    
    console.log(`   ✅ Deleted ${filePaths.length} files`);
    return filePaths.length;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
    return 0;
  }
}

async function cleanupDuplicates() {
  console.log('🧹 CLEANUP DUPLICATE IMAGES');
  console.log('===========================\n');
  
  console.log('📋 Folders to keep (correct structure):');
  FOLDERS_TO_KEEP.forEach(folder => console.log(`   ✅ ${folder}`));
  
  console.log('\n🗑️  Folders to delete (duplicates/wrong):');
  FOLDERS_TO_DELETE.forEach(folder => console.log(`   ❌ ${folder}`));
  
  console.log('\n🚀 Starting cleanup...');
  
  let totalDeleted = 0;
  
  for (const folder of FOLDERS_TO_DELETE) {
    const deleted = await deleteFolder(folder);
    totalDeleted += deleted;
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Total files deleted: ${totalDeleted}`);
  
  // Verify the cleanup
  console.log('\n🔍 Verifying remaining structure...\n');
  
  const { data: projectFolders, error } = await supabase.storage
    .from('images')
    .list('projects', { limit: 100 });
  
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    return;
  }
  
  console.log('📁 Remaining folders in projects/:');
  let totalRemaining = 0;
  
  if (projectFolders) {
    for (const folder of projectFolders) {
      if (folder.name === '.emptyFolderPlaceholder') continue;
      
      const { data: files } = await supabase.storage
        .from('images')
        .list(`projects/${folder.name}`, { limit: 1000 });
      
      const fileCount = files?.filter(f => f.name !== '.emptyFolderPlaceholder').length || 0;
      totalRemaining += fileCount;
      
      const status = FOLDERS_TO_KEEP.includes(`projects/${folder.name}`) ? '✅' : '⚠️';
      console.log(`   ${status} projects/${folder.name}/ (${fileCount} files)`);
    }
  }
  
  console.log(`\n📊 Total remaining files: ${totalRemaining}`);
  console.log(`🎯 Expected: 338 files (60 + 73 + 64 + 81 + 60)`);
}

cleanupDuplicates()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
