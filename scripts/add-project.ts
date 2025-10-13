/**
 * Add a new project to the database
 * Usage: npx tsx scripts/add-project.ts
 * 
 * This script helps you add projects one at a time with proper data structure
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';

const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres.bwddpoellslqtuyrioau:fiRter-2cecki-duqsuk@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = postgres(connectionString);
const db = drizzle(client);

interface ProjectData {
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  year?: number;
  facts?: Record<string, string | number>;
  isPublished?: boolean;
  isHero?: boolean;
}

async function addProject(projectData: ProjectData) {
  try {
    console.log(`📝 Adding project: ${projectData.title}...`);
    
    const [newProject] = await db.insert(projects).values({
      slug: projectData.slug,
      title: projectData.title,
      summary: projectData.summary || '',
      content: projectData.content || '',
      year: projectData.year,
      facts: projectData.facts || {},
      projectImages: [], // Empty array for new image system
      imagePairs: [], // Empty array for new image system
      isPublished: projectData.isPublished ?? false, // Default to draft
      isHero: projectData.isHero ?? false,
      publishedAt: projectData.isPublished ? new Date() : null,
      updatedAt: new Date(),
    }).returning();
    
    console.log(`✅ Project created successfully!`);
    console.log(`   ID: ${newProject.id}`);
    console.log(`   URL: /admin/projects/${newProject.id}`);
    console.log(`   Status: ${newProject.isPublished ? 'Published' : 'Draft'}`);
    console.log('');
    console.log(`🎯 Next: Visit the admin panel to add images and complete the project`);
    
    return newProject;
  } catch (error) {
    console.error('❌ Error adding project:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Example usage - modify this with your real project data
const exampleProject: ProjectData = {
  slug: 'my-project-slug',
  title: 'My Project Title',
  summary: 'A brief summary of the project',
  content: 'Full project description and story...',
  year: 2024,
  facts: {
    'Location': 'Copenhagen',
    'Size': '120 sqm',
    'Duration': '6 months',
  },
  isPublished: false, // Start as draft
  isHero: false,
};

// Run the script
console.log('🚀 Project Import Tool');
console.log('======================\n');

addProject(exampleProject);
