import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { projects, posts } from '@/lib/db/schema';
import { like } from 'drizzle-orm';

export async function POST() {
  try {
    const db = getDb();
    
    // Remove duplicate editorials (ones with local image paths)
    const deletedPosts = await db
      .delete(posts)
      .where(like(posts.coverImagePath, 'post-images/%'))
      .returning();
    
    // Remove duplicate projects (ones with local image paths)
    const deletedProjects = await db
      .delete(projects)
      .where(like(projects.heroImagePath, 'project-images/%'))
      .returning();
    
    return NextResponse.json({
      success: true,
      deleted: {
        posts: deletedPosts.length,
        projects: deletedProjects.length
      }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

