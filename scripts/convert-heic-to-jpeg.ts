/**
 * Convert HEIC files to JPEG format
 * Usage: npx tsx scripts/convert-heic-to-jpeg.ts
 * 
 * This script converts all HEIC files in your project folders to JPEG format
 * so they can be uploaded to Supabase Storage and displayed in browsers.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Check if ImageMagick is installed
 */
async function checkImageMagick(): Promise<boolean> {
  try {
    await execAsync('magick -version');
    return true;
  } catch {
    try {
      await execAsync('convert -version');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Convert HEIC file to JPEG
 */
async function convertHeicToJpeg(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    // Try ImageMagick first (newer versions use 'magick' command)
    try {
      await execAsync(`magick "${inputPath}" -quality 90 "${outputPath}"`);
      return true;
    } catch {
      // Fallback to legacy 'convert' command
      await execAsync(`convert "${inputPath}" -quality 90 "${outputPath}"`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error);
    return false;
  }
}

/**
 * Process a single project folder
 */
async function processProjectFolder(folderPath: string, projectName: string) {
  console.log(`\n📂 Processing: ${projectName}`);
  console.log('─'.repeat(50));

  const beforeFolder = path.join(folderPath, 'Before');
  const afterFolder = path.join(folderPath, 'After');

  let totalConverted = 0;
  let totalErrors = 0;

  // Process Before folder
  if (fs.existsSync(beforeFolder)) {
    const files = fs.readdirSync(beforeFolder);
    const heicFiles = files.filter(f => f.toLowerCase().endsWith('.heic'));

    if (heicFiles.length > 0) {
      console.log(`📸 Found ${heicFiles.length} HEIC files in Before folder`);
      
      for (const heicFile of heicFiles) {
        const heicPath = path.join(beforeFolder, heicFile);
        const jpegPath = path.join(beforeFolder, heicFile.replace(/\.heic$/i, '.jpg'));
        
        console.log(`   Converting ${heicFile}...`);
        
        const success = await convertHeicToJpeg(heicPath, jpegPath);
        if (success) {
          console.log(`   ✅ Converted to ${path.basename(jpegPath)}`);
          totalConverted++;
          
          // Optionally remove the original HEIC file
          // fs.unlinkSync(heicPath);
          // console.log(`   🗑️  Removed original HEIC file`);
        } else {
          console.log(`   ❌ Failed to convert`);
          totalErrors++;
        }
      }
    }
  }

  // Process After folder
  if (fs.existsSync(afterFolder)) {
    const files = fs.readdirSync(afterFolder);
    const heicFiles = files.filter(f => f.toLowerCase().endsWith('.heic'));

    if (heicFiles.length > 0) {
      console.log(`📸 Found ${heicFiles.length} HEIC files in After folder`);
      
      for (const heicFile of heicFiles) {
        const heicPath = path.join(afterFolder, heicFile);
        const jpegPath = path.join(afterFolder, heicFile.replace(/\.heic$/i, '.jpg'));
        
        console.log(`   Converting ${heicFile}...`);
        
        const success = await convertHeicToJpeg(heicPath, jpegPath);
        if (success) {
          console.log(`   ✅ Converted to ${path.basename(jpegPath)}`);
          totalConverted++;
          
          // Optionally remove the original HEIC file
          // fs.unlinkSync(heicPath);
          // console.log(`   🗑️  Removed original HEIC file`);
        } else {
          console.log(`   ❌ Failed to convert`);
          totalErrors++;
        }
      }
    }
  }

  return { converted: totalConverted, errors: totalErrors };
}

/**
 * Main conversion function
 */
async function convertHeicFiles() {
  const projectsPath = path.join(process.env.HOME || '', 'Desktop', 'project-folder');

  if (!fs.existsSync(projectsPath)) {
    console.log(`❌ Project folder not found: ${projectsPath}`);
    console.log('Please make sure your project data is in ~/Desktop/project-folder');
    process.exit(1);
  }

  console.log('🔄 HEIC to JPEG Converter');
  console.log('=========================\n');
  console.log(`📁 Source: ${projectsPath}\n`);

  // Check if ImageMagick is installed
  const hasImageMagick = await checkImageMagick();
  if (!hasImageMagick) {
    console.log('❌ ImageMagick is not installed!');
    console.log('');
    console.log('📦 To install ImageMagick:');
    console.log('   macOS: brew install imagemagick');
    console.log('   Ubuntu: sudo apt-get install imagemagick');
    console.log('   Windows: Download from https://imagemagick.org/script/download.php');
    console.log('');
    console.log('💡 Alternative: You can manually convert HEIC files using:');
    console.log('   - Preview app on macOS (File > Export As > JPEG)');
    console.log('   - Online converters like cloudconvert.com');
    console.log('   - iPhone Photos app (Share > Save to Files > Format: JPEG)');
    process.exit(1);
  }

  console.log('✅ ImageMagick found, starting conversion...\n');

  // Find all project folders
  const projectFolders = fs.readdirSync(projectsPath)
    .filter(f => f.startsWith('Project - '))
    .map(f => path.join(projectsPath, f));

  console.log(`Found ${projectFolders.length} project folders\n`);

  let totalConverted = 0;
  let totalErrors = 0;

  for (const projectFolder of projectFolders) {
    try {
      const projectName = path.basename(projectFolder).replace('Project - ', '');
      const result = await processProjectFolder(projectFolder, projectName);
      
      totalConverted += result.converted;
      totalErrors += result.errors;
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(projectFolder)}:`, error);
      totalErrors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Conversion Complete!');
  console.log(`   Converted: ${totalConverted} files`);
  if (totalErrors > 0) {
    console.log(`   Errors: ${totalErrors} files`);
  }
  
  if (totalConverted > 0) {
    console.log('\n🎯 Next Steps:');
    console.log('1. Run the import script again: npx tsx scripts/import-your-projects.ts');
    console.log('2. All HEIC files are now converted to JPEG format');
    console.log('3. Images will be uploaded to Supabase Storage');
    console.log('4. Before/after pairs will be created automatically');
  } else {
    console.log('\n💡 No HEIC files found to convert.');
    console.log('You can run the import script directly: npx tsx scripts/import-your-projects.ts');
  }
}

// Run conversion
convertHeicFiles().catch(console.error);
