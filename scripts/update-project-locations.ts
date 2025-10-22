#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

interface Project {
  id: string;
  title: string;
  slug: string;
  facts: Record<string, any>;
}

async function updateProjectLocation(projectId: string, location: string) {
  try {
    // Fetch current project
    const response = await fetch(`http://localhost:3001/api/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }
    
    const { project } = await response.json();
    
    // Update facts with location
    const updatedFacts = {
      ...project.facts,
      location: location
    };
    
    // Update project
    const updateResponse = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...project,
        facts: updatedFacts
      })
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Failed to update project: ${updateResponse.statusText}`);
    }
    
    const { project: updatedProject } = await updateResponse.json();
    console.log(`✅ Updated ${updatedProject.title}: location = ${location}`);
    
    return updatedProject;
  } catch (error) {
    console.error(`❌ Error updating project ${projectId}:`, error);
    throw error;
  }
}

async function main() {
  console.log('🌍 Project Location Update Script\n');
  console.log('=' .repeat(60));

  // Project locations based on their content and context
  const projectLocations = [
    { slug: 'the-nest', location: 'Marbella' },
    { slug: 'no1-oestermalm', location: 'Stockholm' },
    { slug: 'grand-celeste', location: 'Marbella' },
    { slug: 'classic-pearl', location: 'Marbella' }
  ];

  try {
    // First, get all projects to find their IDs
    const projectsResponse = await fetch('http://localhost:3001/api/projects');
    if (!projectsResponse.ok) {
      throw new Error(`Failed to fetch projects: ${projectsResponse.statusText}`);
    }
    
    const projects: Project[] = await projectsResponse.json();
    console.log(`📊 Found ${projects.length} projects\n`);

    // Update each project's location
    for (const { slug, location } of projectLocations) {
      const project = projects.find(p => p.slug === slug);
      if (project) {
        await updateProjectLocation(project.id, location);
      } else {
        console.log(`⚠️ Project with slug "${slug}" not found`);
      }
    }

    console.log('\n🎉 All project locations updated successfully!');
    
    // Verify the updates
    console.log('\n📋 Verification:');
    const verifyResponse = await fetch('http://localhost:3001/api/projects');
    const verifyProjects: Project[] = await verifyResponse.json();
    
    verifyProjects.forEach(project => {
      const location = project.facts?.location || 'Not set';
      console.log(`  ${project.title}: ${location}`);
    });

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
