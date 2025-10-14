import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectsFolder() {
  console.log('🔍 Checking projects/ folder structure');
  console.log('======================================\n');

  try {
    // List files in projects/ folder
    const { data: projectFolders, error: foldersError } = await supabase.storage
      .from('images')
      .list('projects', { limit: 100 });
    
    if (foldersError) {
      console.error(`Error: ${foldersError.message}`);
      return;
    }
    
    if (!projectFolders) {
      console.log('No projects/ folder found');
      return;
    }
    
    console.log(`Found ${projectFolders.length} items in projects/:\n`);
    
    let totalFiles = 0;
    
    for (const folder of projectFolders) {
      if (folder.name === '.emptyFolderPlaceholder') continue;
      
      console.log(`📁 projects/${folder.name}/`);
      
      // List files in this project folder
      const { data: files, error: filesError } = await supabase.storage
        .from('images')
        .list(`projects/${folder.name}`, { limit: 1000 });
      
      if (filesError) {
        console.error(`   Error: ${filesError.message}`);
        continue;
      }
      
      const fileCount = files?.filter(f => f.name !== '.emptyFolderPlaceholder').length || 0;
      totalFiles += fileCount;
      
      console.log(`   Files: ${fileCount}`);
      
      // Show first few files as examples
      if (files && files.length > 0) {
        const examples = files.slice(0, 3).map(f => f.name);
        console.log(`   Examples: ${examples.join(', ')}`);
      }
      console.log('');
    }
    
    console.log(`📊 Total files in projects/: ${totalFiles}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProjectsFolder()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
