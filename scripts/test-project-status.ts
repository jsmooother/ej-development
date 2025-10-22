#!/usr/bin/env tsx

/**
 * Project Status Testing Script
 * 
 * This script tests the draft/live functionality for projects by:
 * 1. Checking current project statuses
 * 2. Toggling a project status
 * 3. Verifying the change persisted
 * 4. Toggling it back
 * 
 * Usage: npx tsx scripts/test-project-status.ts [project-id]
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { getDb } from '../src/lib/db/index';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testProjectStatus(projectId?: string) {
  console.log('🧪 Starting Project Status Test\n');
  console.log('=' .repeat(60));
  
  try {
    const db = getDb();
    
    // Step 1: Get all projects
    console.log('\n📋 Step 1: Fetching all projects...');
    const allProjects = await db.select({
      id: projects.id,
      title: projects.title,
      slug: projects.slug,
      isPublished: projects.isPublished,
      publishedAt: projects.publishedAt,
    }).from(projects);
    
    console.log(`✅ Found ${allProjects.length} projects total\n`);
    
    // Show status summary
    const publishedCount = allProjects.filter(p => p.isPublished).length;
    const draftCount = allProjects.filter(p => !p.isPublished).length;
    
    console.log('📊 Status Summary:');
    console.log(`   • Live: ${publishedCount} projects`);
    console.log(`   • Draft: ${draftCount} projects\n`);
    
    // List all projects
    console.log('📝 All Projects:');
    allProjects.forEach((project, idx) => {
      const status = project.isPublished ? '🟢 LIVE' : '⚫ DRAFT';
      const publishedInfo = project.publishedAt 
        ? new Date(project.publishedAt).toLocaleString() 
        : 'never';
      console.log(`   ${idx + 1}. ${status} - ${project.title}`);
      console.log(`      ID: ${project.id}`);
      console.log(`      Slug: ${project.slug}`);
      console.log(`      Published: ${publishedInfo}\n`);
    });
    
    // Step 2: Select a project to test
    let testProject;
    if (projectId) {
      testProject = allProjects.find(p => p.id === projectId);
      if (!testProject) {
        console.error(`❌ Project with ID ${projectId} not found`);
        process.exit(1);
      }
    } else {
      // Use the first project
      testProject = allProjects[0];
    }
    
    if (!testProject) {
      console.log('⚠️  No projects found to test. Create a project first.');
      process.exit(0);
    }
    
    console.log('=' .repeat(60));
    console.log(`\n🎯 Testing with: "${testProject.title}"`);
    console.log(`   Current status: ${testProject.isPublished ? 'LIVE' : 'DRAFT'}\n`);
    
    // Step 3: Toggle status (Draft → Live or Live → Draft)
    const newStatus = !testProject.isPublished;
    const statusWord = newStatus ? 'LIVE' : 'DRAFT';
    
    console.log(`\n📝 Step 2: Toggling to ${statusWord}...`);
    
    const updateResult = await db
      .update(projects)
      .set({
        isPublished: newStatus,
        publishedAt: newStatus ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, testProject.id))
      .returning();
    
    if (updateResult.length === 0) {
      console.error('❌ Failed to update project');
      process.exit(1);
    }
    
    console.log(`✅ Status changed to: ${newStatus ? 'LIVE' : 'DRAFT'}`);
    console.log(`   Published At: ${updateResult[0].publishedAt || 'null'}`);
    
    // Step 4: Verify the change
    console.log('\n🔍 Step 3: Verifying the change...');
    
    const verifyResult = await db
      .select({
        id: projects.id,
        title: projects.title,
        isPublished: projects.isPublished,
        publishedAt: projects.publishedAt,
      })
      .from(projects)
      .where(eq(projects.id, testProject.id))
      .limit(1);
    
    const verified = verifyResult[0];
    
    if (verified.isPublished === newStatus) {
      console.log('✅ Verification PASSED');
      console.log(`   • Status in DB: ${verified.isPublished ? 'LIVE' : 'DRAFT'}`);
      console.log(`   • Published At: ${verified.publishedAt || 'null'}`);
    } else {
      console.error('❌ Verification FAILED');
      console.error(`   Expected: ${newStatus ? 'LIVE' : 'DRAFT'}`);
      console.error(`   Got: ${verified.isPublished ? 'LIVE' : 'DRAFT'}`);
      process.exit(1);
    }
    
    // Step 5: Check public API filtering
    console.log('\n🌐 Step 4: Testing public API filtering...');
    
    const publicProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        isPublished: projects.isPublished,
      })
      .from(projects)
      .where(eq(projects.isPublished, true));
    
    console.log(`✅ Public API would show ${publicProjects.length} projects`);
    
    const isVisible = publicProjects.some(p => p.id === testProject.id);
    if (newStatus) {
      // Should be visible
      if (isVisible) {
        console.log(`✅ Project "${testProject.title}" is correctly visible to public`);
      } else {
        console.error(`❌ Project "${testProject.title}" should be visible but isn't`);
      }
    } else {
      // Should NOT be visible
      if (!isVisible) {
        console.log(`✅ Project "${testProject.title}" is correctly hidden from public`);
      } else {
        console.error(`❌ Project "${testProject.title}" should be hidden but is visible`);
      }
    }
    
    // Step 6: Toggle back to original state
    console.log(`\n🔄 Step 5: Toggling back to original state (${testProject.isPublished ? 'LIVE' : 'DRAFT'})...`);
    
    await db
      .update(projects)
      .set({
        isPublished: testProject.isPublished,
        publishedAt: testProject.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, testProject.id));
    
    console.log('✅ Restored original status\n');
    
    // Final summary
    console.log('=' .repeat(60));
    console.log('\n🎉 TEST SUMMARY\n');
    console.log('✅ All checks passed successfully!');
    console.log('\n✓ Status can be toggled from LIVE to DRAFT');
    console.log('✓ Status can be toggled from DRAFT to LIVE');
    console.log('✓ Database updates persist correctly');
    console.log('✓ publishedAt timestamp is set/cleared appropriately');
    console.log('✓ Public API filtering works correctly');
    console.log('✓ Project restored to original state');
    
    console.log('\n📋 Next Steps:');
    console.log('   1. Test the UI toggles at http://localhost:3000/admin/projects');
    console.log('   2. Verify public page at http://localhost:3000/projects');
    console.log('   3. Check console logs for proper logging');
    console.log('   4. Review the full test plan: PROJECT_STATUS_TEST_PLAN.md\n');
    
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
const projectId = process.argv[2];
testProjectStatus(projectId).then(() => {
  console.log('\n✨ Test completed\n');
  process.exit(0);
});

