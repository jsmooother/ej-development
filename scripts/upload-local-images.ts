import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const dbUrl = process.env.SUPABASE_DB_URL!;

if (!supabaseUrl || !supabaseKey || !dbUrl) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const client = postgres(dbUrl);
const db = drizzle(client);

interface ImageUploadData {
  projectSlug: string;
  localPath: string;
  tags: string[];
  caption?: string;
  altText?: string;
}

async function uploadImageToStorage(imageData: ImageUploadData): Promise<string | null> {
  try {
    // Generate clean filename
    const fileExt = path.extname(imageData.localPath);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanFilename = `${imageData.projectSlug}-${timestamp}-${randomSuffix}${fileExt}`;
    const storagePath = `projects/${imageData.projectSlug}/${cleanFilename}`;

    // Read file
    const fileBuffer = fs.readFileSync(imageData.localPath);
    
    // Get file stats for metadata
    const stats = fs.statSync(imageData.localPath);
    
    // Fix MIME type for jpg files
    let mimeType = fileExt.slice(1).toLowerCase();
    if (mimeType === 'jpg') {
      mimeType = 'jpeg';
    }
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${mimeType}`,
        upsert: false
      });

    if (error) {
      console.error(`❌ Upload error for ${path.basename(imageData.localPath)}: ${error.message}`);
      return null;
    }

    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    console.log(`✅ Uploaded: ${path.basename(imageData.localPath)} → ${cleanFilename}`);
    return urlData.publicUrl;

  } catch (error) {
    console.error(`❌ Upload error for ${path.basename(imageData.localPath)}: ${error}`);
    return null;
  }
}

async function updateProjectWithImages(projectSlug: string, images: any[]) {
  try {
    // Get project from database
    const projectResult = await db.select().from(projects).where(eq(projects.slug, projectSlug));
    
    if (projectResult.length === 0) {
      console.error(`❌ Project not found: ${projectSlug}`);
      return;
    }

    const project = projectResult[0];

    // Create proper image objects for database
    const projectImages = images.map((img, index) => ({
      id: randomUUID(),
      url: img.url,
      tags: img.tags,
      caption: img.caption || `${projectSlug} image ${index + 1}`,
      altText: img.altText || `${project.title} - ${img.caption || `Image ${index + 1}`}`,
      uploadedAt: new Date().toISOString(),
      fileSize: img.fileSize || null,
      dimensions: img.dimensions || null
    }));

    // Create image pairs (before/after combinations)
    const beforeImages = projectImages.filter(img => img.tags.includes('before'));
    const afterImages = projectImages.filter(img => img.tags.includes('after'));
    
    const imagePairs = [];
    const maxPairs = Math.min(8, Math.min(beforeImages.length, afterImages.length));
    
    for (let i = 0; i < maxPairs; i++) {
      if (beforeImages[i] && afterImages[i]) {
        imagePairs.push({
          id: randomUUID(),
          label: `Before & After ${i + 1}`,
          beforeImageId: beforeImages[i].id,
          afterImageId: afterImages[i].id
        });
      }
    }

    // Set hero image (first after image, or first gallery image, or first image)
    const heroImage = afterImages[0] || 
                     projectImages.find(img => img.tags.includes('hero')) ||
                     projectImages.find(img => img.tags.includes('gallery')) ||
                     projectImages[0];

    // Update project in database
    await db
      .update(projects)
      .set({
        projectImages: projectImages,
        imagePairs: imagePairs,
        heroImagePath: heroImage?.url || null
      })
      .where(eq(projects.id, project.id));

    console.log(`✅ Updated database for ${project.title}:`);
    console.log(`   📊 Images: ${projectImages.length}`);
    console.log(`   🔗 Pairs: ${imagePairs.length}`);
    console.log(`   🖼️  Hero: ${heroImage ? 'Set' : 'None'}`);

    // Show tag distribution
    const tagCounts = projectImages.reduce((acc: any, img: any) => {
      img.tags.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});
    console.log(`   📋 Tags: ${JSON.stringify(tagCounts)}`);

  } catch (error) {
    console.error(`❌ Database update error: ${error}`);
  }
}

async function scanLocalFolder(folderPath: string): Promise<ImageUploadData[]> {
  console.log(`📁 Scanning folder: ${folderPath}\n`);
  
  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder does not exist: ${folderPath}`);
    return [];
  }

  const images: ImageUploadData[] = [];
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  function scanDirectory(dir: string, projectSlug: string, subfolder: string = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        const newSubfolder = subfolder ? `${subfolder}/${item}` : item;
        scanDirectory(itemPath, projectSlug, newSubfolder);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          // Determine tags based on folder structure
          let tags: string[] = [];
          
          if (subfolder.toLowerCase().includes('before')) {
            tags = ['before'];
          } else if (subfolder.toLowerCase().includes('after')) {
            tags = ['after', 'gallery']; // After images also go to gallery
          } else if (subfolder.toLowerCase().includes('gallery')) {
            tags = ['gallery'];
          } else if (subfolder.toLowerCase().includes('hero')) {
            tags = ['hero', 'gallery'];
          } else {
            // Default to gallery if no specific folder
            tags = ['gallery'];
          }
          
          images.push({
            projectSlug: projectSlug,
            localPath: itemPath,
            tags: tags,
            caption: path.parse(item).name.replace(/-/g, ' ').replace(/_/g, ' '),
            altText: `${projectSlug} - ${path.parse(item).name}`
          });
        }
      }
    }
  }
  
  // Scan for project subdirectories
  const items = fs.readdirSync(folderPath);
  const projectDirs = items.filter(item => {
    const itemPath = path.join(folderPath, item);
    return fs.statSync(itemPath).isDirectory();
  });
  
  if (projectDirs.length === 0) {
    // No subdirectories, treat as single project
    const folderName = path.basename(folderPath);
    const projectSlug = folderName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    scanDirectory(folderPath, projectSlug);
  } else {
    // Process each project directory
    for (const projectDir of projectDirs) {
      const projectPath = path.join(folderPath, projectDir);
      const projectSlug = projectDir.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      console.log(`📁 Found project: ${projectDir} (slug: ${projectSlug})`);
      scanDirectory(projectPath, projectSlug);
    }
  }
  
  console.log(`📊 Found ${images.length} images:`);
  const tagCounts = images.reduce((acc: any, img: any) => {
    img.tags.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  console.log(`   📋 Tags: ${JSON.stringify(tagCounts)}`);
  
  return images;
}

async function uploadAllImages() {
  console.log('📤 UPLOAD ALL LOCAL IMAGES');
  console.log('==========================\n');

  // Define the local folder path - update this to your actual folder
  const localFolderPath = '/Users/jesper/Desktop/project-folder'; // Update this path
  
  console.log(`🎯 Target folder: ${localFolderPath}`);
  console.log('📋 Supported formats: .jpg, .jpeg, .png, .webp, .gif\n');

  try {
    // Scan local folder for images
    const imagesToUpload = await scanLocalFolder(localFolderPath);
    
    if (imagesToUpload.length === 0) {
      console.log('⚠️  No images found to upload');
      return;
    }

    console.log(`\n🚀 Starting upload of ${imagesToUpload.length} images...\n`);

    // Group images by project
    const imagesByProject = imagesToUpload.reduce((acc: any, img: any) => {
      if (!acc[img.projectSlug]) {
        acc[img.projectSlug] = [];
      }
      acc[img.projectSlug].push(img);
      return acc;
    }, {});

    // Upload images for each project
    for (const [projectSlug, projectImages] of Object.entries(imagesByProject)) {
      console.log(`📁 Processing project: ${projectSlug}`);
      console.log(`   📄 Images to upload: ${(projectImages as any[]).length}\n`);

      const uploadedImages: any[] = [];

      // Upload each image
      for (const imageData of projectImages as ImageUploadData[]) {
        const url = await uploadImageToStorage(imageData);
        
        if (url) {
          uploadedImages.push({
            url: url,
            tags: imageData.tags,
            caption: imageData.caption,
            altText: imageData.altText
          });
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (uploadedImages.length > 0) {
        // Update project in database
        await updateProjectWithImages(projectSlug, uploadedImages);
        console.log(`✅ Completed ${projectSlug}: ${uploadedImages.length} images uploaded\n`);
      } else {
        console.log(`⚠️  No images uploaded for ${projectSlug}\n`);
      }
    }

    console.log('🎉 All images uploaded successfully!');
    console.log('🚀 Check your admin interface to see the uploaded images');

  } catch (error) {
    console.error('❌ Error during upload:', error);
  }
}

uploadAllImages()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
