import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Get the current hero project
    const heroProject = await db.select().from(projects).where(eq(projects.isHero, true));
    
    return NextResponse.json(heroProject[0] || null);
  } catch (error) {
    console.error('Error fetching hero project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    
    // First, remove hero status from all projects
    await db
      .update(projects)
      .set({ 
        isHero: false,
        updatedAt: new Date()
      })
      .where(eq(projects.isHero, true));
    
    // Then, set the selected project as hero
    await db
      .update(projects)
      .set({ 
        isHero: true,
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
