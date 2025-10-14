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
    
    console.log('📊 Fetched project:', {
      id: project[0].id,
      title: project[0].title,
      projectImagesCount: project[0].projectImages?.length || 0,
      imagePairsCount: project[0].imagePairs?.length || 0,
      hasProjectImagesData: !!project[0].projectImages,
    });
    
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
    
    console.log('📥 PUT Request for project:', params.id);
    console.log('📊 Received data:', {
      title: body.title,
      projectImagesCount: body.projectImages?.length || 0,
      imagePairsCount: body.imagePairs?.length || 0,
      isPublished: body.isPublished,
    });
    
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
        projectImages: body.projectImages || [],
        imagePairs: body.imagePairs || [],
        isPublished: body.isPublished,
        publishedAt: body.isPublished ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, params.id))
      .returning();
    
    if (!updatedProject || updatedProject.length === 0) {
      console.error('❌ Project not found:', params.id);
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }
    
    console.log('✅ Updated project in DB:', {
      id: updatedProject[0].id,
      title: updatedProject[0].title,
      projectImagesCount: updatedProject[0].projectImages?.length || 0,
      imagePairsCount: updatedProject[0].imagePairs?.length || 0,
      isPublished: updatedProject[0].isPublished,
    });
    
    return NextResponse.json({
      success: true,
      project: updatedProject[0]
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (typeof body.isPublished !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'isPublished must be provided as a boolean value',
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const updatedProject = await db
      .update(projects)
      .set({
        isPublished: body.isPublished,
        publishedAt: body.isPublished ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, params.id))
      .returning();

    if (!updatedProject || updatedProject.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Updated project publish state via PATCH:', {
      id: updatedProject[0].id,
      isPublished: updatedProject[0].isPublished,
    });

    return NextResponse.json({
      success: true,
      project: updatedProject[0],
    });
  } catch (error) {
    console.error('❌ Database error while patching project status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
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

