import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/db/schema';
import { getDb } from '@/lib/db/index';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const project = await db.select().from(projects).where(eq(projects.id, params.id)).limit(1);
    
    if (!project || project.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      project: project[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = getDb();
    
    // Update the project
    const updatedProject = await db
      .update(projects)
      .set({
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        content: body.content,
        year: body.year,
        facts: body.facts,
        heroImagePath: body.heroImagePath,
        isPublished: body.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, params.id))
      .returning();
    
    if (!updatedProject || updatedProject.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      project: updatedProject[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    
    const deletedProject = await db
      .delete(projects)
      .where(eq(projects.id, params.id))
      .returning();
    
    if (!deletedProject || deletedProject.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

