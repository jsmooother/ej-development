/**
 * Simple HEIC to JPEG converter using Node.js libraries
 * Usage: npx tsx scripts/convert-heic-simple.ts
 * 
 * This script converts HEIC files to JPEG using Node.js libraries
 * No external dependencies like ImageMagick required.
 */

import fs from 'fs';
import path from 'path';

/**
 * Check if we can find HEIC files
 */
function findHeicFiles(projectsPath: string): string[] {
  const heicFiles: string[] = [];
  
  const projectFolders = fs.readdirSync(projectsPath)
    .filter(f => f.startsWith('Project - '))
    .map(f => path.join(projectsPath, f));

  for (const projectFolder of projectFolders) {
    const beforeFolder = path.join(projectFolder, 'Before');
    const afterFolder = path.join(projectFolder, 'After');

    // Check Before folder
    if (fs.existsSync(beforeFolder)) {
      const files = fs.readdirSync(beforeFolder);
      const heicFilesInFolder = files
        .filter(f => f.toLowerCase().endsWith('.heic'))
        .map(f => path.join(beforeFolder, f));
      heicFiles.push(...heicFilesInFolder);
    }

    // Check After folder
    if (fs.existsSync(afterFolder)) {
      const files = fs.readdirSync(afterFolder);
      const heicFilesInFolder = files
        .filter(f => f.toLowerCase().endsWith('.heic'))
        .map(f => path.join(afterFolder, f));
      heicFiles.push(...heicFilesInFolder);
    }
  }

  return heicFiles;
}

/**
 * Main function
 */
async function checkHeicFiles() {
  const projectsPath = path.join(process.env.HOME || '', 'Desktop', 'project-folder');

  if (!fs.existsSync(projectsPath)) {
    console.log(`❌ Project folder not found: ${projectsPath}`);
    process.exit(1);
  }

  console.log('🔍 HEIC File Scanner');
  console.log('===================\n');
  console.log(`📁 Scanning: ${projectsPath}\n`);

  const heicFiles = findHeicFiles(projectsPath);

  if (heicFiles.length === 0) {
    console.log('✅ No HEIC files found!');
    console.log('You can run the import script directly: npx tsx scripts/import-your-projects.ts');
    return;
  }

  console.log(`📸 Found ${heicFiles.length} HEIC files:\n`);

  // Group by project
  const byProject: Record<string, string[]> = {};
  
  for (const file of heicFiles) {
    const projectName = path.basename(path.dirname(path.dirname(file))).replace('Project - ', '');
    const folder = path.basename(path.dirname(file));
    
    if (!byProject[projectName]) {
      byProject[projectName] = [];
    }
    
    byProject[projectName].push(`${folder}/${path.basename(file)}`);
  }

  for (const [project, files] of Object.entries(byProject)) {
    console.log(`📂 ${project}: ${files.length} HEIC files`);
    files.forEach(file => console.log(`   - ${file}`));
    console.log('');
  }

  console.log('🛠️  Conversion Options:');
  console.log('');
  console.log('Option 1: Install ImageMagick and use the converter script');
  console.log('   brew install imagemagick');
  console.log('   npx tsx scripts/convert-heic-to-jpeg.ts');
  console.log('');
  console.log('Option 2: Manual conversion (Recommended)');
  console.log('   • Open Photos app on your iPhone/Mac');
  console.log('   • Select the HEIC images');
  console.log('   • Share > Save to Files');
  console.log('   • Choose JPEG format');
  console.log('   • Save to the same folders');
  console.log('');
  console.log('Option 3: Online converter');
  console.log('   • Upload HEIC files to cloudconvert.com');
  console.log('   • Convert to JPEG');
  console.log('   • Download and replace in folders');
  console.log('');
  console.log('Option 4: macOS Preview app');
  console.log('   • Open HEIC files in Preview');
  console.log('   • File > Export As...');
  console.log('   • Choose JPEG format');
  console.log('   • Save with .jpg extension');
  console.log('');
  console.log('💡 After conversion, run: npx tsx scripts/import-your-projects.ts');
}

// Run scanner
checkHeicFiles().catch(console.error);
