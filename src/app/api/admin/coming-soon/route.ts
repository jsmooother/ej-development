import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { comingSoonProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Get the active coming soon project
    const activeProject = await db.select().from(comingSoonProjects).where(eq(comingSoonProjects.isActive, true));
    
    return NextResponse.json(activeProject[0] || null);
  } catch (error) {
    console.error('Error fetching coming soon project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, highlights, isActive } = body;
    
    if (!title || !description || !Array.isArray(highlights)) {
      return NextResponse.json(
        { error: 'Title, description, and highlights are required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    
    // If setting as active, first deactivate all other projects
    if (isActive) {
      await db
        .update(comingSoonProjects)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(comingSoonProjects.isActive, true));
    }
    
    // Create new coming soon project
    const newProject = await db
      .insert(comingSoonProjects)
      .values({
        title,
        description,
        highlights,
        isActive: isActive || false,
      })
      .returning();
    
    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error('Error creating coming soon project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, highlights, isActive } = body;
    
    if (!id || !title || !description || !Array.isArray(highlights)) {
      return NextResponse.json(
        { error: 'ID, title, description, and highlights are required' },
        { status: 400 }
      );
    }
    
    const db = getDb();
    
    // If setting as active, first deactivate all other projects
    if (isActive) {
      await db
        .update(comingSoonProjects)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(comingSoonProjects.isActive, true));
    }
    
    // Update the project
    const updatedProject = await db
      .update(comingSoonProjects)
      .set({
        title,
        description,
        highlights,
        isActive: isActive || false,
        updatedAt: new Date(),
      })
      .where(eq(comingSoonProjects.id, id))
      .returning();
    
    return NextResponse.json(updatedProject[0]);
  } catch (error) {
    console.error('Error updating coming soon project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
