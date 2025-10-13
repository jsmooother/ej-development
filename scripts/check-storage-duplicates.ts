import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllFiles(prefix: string = ''): Promise<any[]> {
  const allFiles: any[] = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase.storage
      .from('images')
      .list(prefix, { limit, offset });
    
    if (error) {
      console.error(`Error listing files: ${error.message}`);
      break;
    }
    
    if (!data || data.length === 0) break;
    
    allFiles.push(...data);
    
    if (data.length < limit) break;
    offset += limit;
  }
  
  return allFiles;
}

async function checkStorageDuplicates() {
  console.log('🔍 Checking for duplicate files in storage');
  console.log('==========================================\n');

  try {
    // List all top-level folders/files
    const topLevel = await listAllFiles('');
    
    let totalFiles = 0;
    const projectStats: Record<string, number> = {};
    
    for (const item of topLevel) {
      if (item.name === '.emptyFolderPlaceholder') continue;
      
      console.log(`📁 ${item.name}/`);
      
      // List files in this folder
      const files = await listAllFiles(item.name);
      const fileCount = files.filter(f => f.name !== '.emptyFolderPlaceholder').length;
      
      projectStats[item.name] = fileCount;
      totalFiles += fileCount;
      
      console.log(`   Files: ${fileCount}\n`);
    }
    
    console.log('📊 Summary:');
    console.log('===========');
    for (const [project, count] of Object.entries(projectStats)) {
      console.log(`${project}: ${count} files`);
    }
    console.log(`\nTotal files in storage: ${totalFiles}`);
    
    // Expected counts (from database)
    const expectedCounts = {
      'classic-pearl': 60,
      'grand-celeste': 73,
      'the-nest': 81,
      'wallin-revival': 60,
      'no1-oestermalm': 64 // or 'no1-o-stermalm' if not updated yet
    };
    
    console.log('\n🎯 Expected vs Actual:');
    console.log('======================');
    
    let hasDuplicates = false;
    for (const [project, expected] of Object.entries(expectedCounts)) {
      const actual = projectStats[`projects/${project}`] || projectStats[project] || 0;
      const status = actual > expected ? '⚠️  DUPLICATES!' : actual === expected ? '✅' : '❌ Missing';
      console.log(`${project}: Expected ${expected}, Found ${actual} ${status}`);
      
      if (actual > expected) hasDuplicates = true;
    }
    
    if (hasDuplicates) {
      console.log('\n⚠️  DUPLICATES DETECTED! Run cleanup script.');
    } else {
      console.log('\n✅ No duplicates detected!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkStorageDuplicates()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
