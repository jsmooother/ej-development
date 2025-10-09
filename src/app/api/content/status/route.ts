import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { projects, posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch projects status
    const projects = await db.query.projects.findMany({
      columns: { slug: true, isPublished: true }
    });
    const projectsStatus = projects.reduce((acc, project) => {
      acc[project.slug] = project.isPublished;
      return acc;
    }, {} as Record<string, boolean>);
    
    // Fetch editorials status
    const editorials = await db.query.posts.findMany({
      columns: { slug: true, isPublished: true }
    });
    const editorialsStatus = editorials.reduce((acc, editorial) => {
      acc[editorial.slug] = editorial.isPublished;
      return acc;
    }, {} as Record<string, boolean>);
    
    return NextResponse.json({
      projects: projectsStatus,
      editorials: editorialsStatus
    });
  } catch (error) {
    console.error('Error fetching content status:', error);
    // Return empty status if DB fails
    return NextResponse.json({
      projects: {},
      editorials: {}
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, id, isPublished } = await request.json();
    const db = getDb();
    
    if (type === 'project') {
      // Update project in database
      await db
        .update(projects)
        .set({ 
          isPublished,
          publishedAt: isPublished ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        })
        .where(eq(projects.slug, id));
        
      console.log(`Updated project ${id} to ${isPublished ? 'published' : 'draft'}`);
    } else if (type === 'editorial') {
      // Update editorial in database
      await db
        .update(posts)
        .set({ 
          isPublished,
          publishedAt: isPublished ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        })
        .where(eq(posts.slug, id));
        
      console.log(`Updated editorial ${id} to ${isPublished ? 'published' : 'draft'}`);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
