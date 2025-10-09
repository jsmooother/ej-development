import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { posts } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }
    
    // Create new editorial
    const newEditorial = await db
      .insert(posts)
      .values({
        id: randomUUID(),
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        content: body.content || '',
        coverImagePath: body.coverImagePath || '',
        tags: body.tags || [],
        isPublished: body.isPublished || false,
        publishedAt: body.isPublished ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return NextResponse.json(newEditorial[0]);
  } catch (error) {
    console.error('Error creating editorial:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create editorial' },
      { status: 500 }
    );
  }
}
