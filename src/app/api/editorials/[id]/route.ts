import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const editorialId = params.id;

    // Fetch editorial by ID
    const editorial = await db.query.posts.findFirst({
      where: eq(posts.id, editorialId),
    });

    if (!editorial) {
      return NextResponse.json(
        { error: 'Editorial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(editorial);
  } catch (error) {
    console.error('Error fetching editorial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch editorial' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const editorialId = params.id;
    const body = await request.json();

    // Update editorial
    const updatedEditorial = await db
      .update(posts)
      .set({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImagePath: body.coverImagePath,
        tags: body.tags,
        isPublished: body.isPublished,
        publishedAt: body.isPublished ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, editorialId))
      .returning();

    if (updatedEditorial.length === 0) {
      return NextResponse.json(
        { error: 'Editorial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEditorial[0]);
  } catch (error) {
    console.error('Error updating editorial:', error);
    return NextResponse.json(
      { error: 'Failed to update editorial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const editorialId = params.id;

    // Delete editorial
    const deletedEditorial = await db
      .delete(posts)
      .where(eq(posts.id, editorialId))
      .returning();

    if (deletedEditorial.length === 0) {
      return NextResponse.json(
        { error: 'Editorial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting editorial:', error);
    return NextResponse.json(
      { error: 'Failed to delete editorial' },
      { status: 500 }
    );
  }
}
