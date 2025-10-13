/**
 * Import Real Projects for Production
 * Usage: npx tsx scripts/import-real-projects.ts
 * 
 * Add your real project data here before going live
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';

const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres.bwddpoellslqtuyrioau:fiRter-2cecki-duqsuk@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = postgres(connectionString);
const db = drizzle(client);

interface ProjectTemplate {
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number;
  facts: Record<string, string | number>;
  isPublished: boolean;
  isHero: boolean;
}

// ============================================
// ADD YOUR REAL PROJECTS HERE
// ============================================

const realProjects: ProjectTemplate[] = [
  // Example Project 1
  {
    slug: 'vesterbro-apartment',
    title: 'Vesterbro Apartment',
    summary: 'Modern renovation of a classic Copenhagen apartment',
    content: `This stunning apartment in Vesterbro combines modern design with classic Copenhagen architecture.
    
The project focused on creating an open, light-filled space while preserving the building's historical character. We carefully restored original features including herringbone parquet floors and ornate ceiling moldings, while introducing contemporary elements such as a sleek kitchen and modern bathroom fixtures.

The color palette draws inspiration from Scandinavian design principles, featuring warm whites, natural wood tones, and subtle accent colors that create a serene yet sophisticated atmosphere.`,
    year: 2024,
    facts: {
      'Location': 'Vesterbro, Copenhagen',
      'Size': '95 sqm',
      'Rooms': '3',
      'Duration': '4 months',
      'Budget': '€85,000',
    },
    isPublished: false, // Will publish after adding images
    isHero: false,
  },
  
  // Example Project 2
  {
    slug: 'norreport-office',
    title: 'Nørreport Office Space',
    summary: 'Creative workspace design for a tech startup',
    content: `A dynamic office space designed for a growing tech startup in the heart of Copenhagen.
    
The design prioritizes flexibility and collaboration, with modular furniture systems that can be easily reconfigured as the team grows. We incorporated biophilic design elements including living walls and natural materials to enhance wellbeing and productivity.

Large windows and strategic lighting design ensure the space is filled with natural light throughout the day, while dedicated quiet zones provide space for focused work.`,
    year: 2023,
    facts: {
      'Location': 'Nørreport, Copenhagen',
      'Size': '180 sqm',
      'Capacity': '25 people',
      'Duration': '6 months',
    },
    isPublished: false,
    isHero: false,
  },
  
  // Add more projects here...
];

async function importProjects() {
  console.log('🚀 Importing Real Projects');
  console.log('==========================\n');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of realProjects) {
      try {
        console.log(`📝 Creating: ${project.title}...`);
        
        const [newProject] = await db.insert(projects).values({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          content: project.content,
          year: project.year,
          facts: project.facts,
          projectImages: [], // Images will be added via admin panel
          imagePairs: [], // Pairs will be created via admin panel
          isPublished: project.isPublished,
          isHero: project.isHero,
          publishedAt: project.isPublished ? new Date() : null,
          updatedAt: new Date(),
        }).returning();
        
        console.log(`   ✅ Created successfully!`);
        console.log(`   ID: ${newProject.id}`);
        console.log(`   Admin URL: http://localhost:3000/admin/projects/${newProject.id}`);
        console.log('');
        
        successCount++;
      } catch (error) {
        console.error(`   ❌ Error creating project: ${project.title}`);
        console.error(`   ${error}`);
        console.log('');
        errorCount++;
      }
    }
    
    console.log('=========================');
    console.log(`✅ Import Complete!`);
    console.log(`   Success: ${successCount} projects`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} projects`);
    }
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Visit the admin panel at http://localhost:3000/admin/projects');
    console.log('2. Add images to each project (they will be automatically compressed)');
    console.log('3. Create before/after pairs if applicable');
    console.log('4. Toggle "Publish to site" when ready to go live');
    console.log('5. Set one project as "Hero Project" for the homepage');
    console.log('');
    console.log('💡 Tips:');
    console.log('- Images are automatically compressed to save storage');
    console.log('- Use the storage dashboard to monitor your 1GB free tier limit');
    console.log('- Toggle states are now fully synchronized');
    console.log('- All data uses the new optimized structure');
    
  } catch (error) {
    console.error('❌ Fatal error during import:', error);
  } finally {
    await client.end();
  }
}

// Run the import
importProjects();
