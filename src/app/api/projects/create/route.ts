import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    
    // If setting as hero, first remove hero status from all other projects
    if (body.isHero) {
      await db
        .update(projects)
        .set({ isHero: false, updatedAt: new Date() })
        .where(eq(projects.isHero, true));
    }
    
    // Create new project
    const newProject = await db
      .insert(projects)
      .values({
        id: randomUUID(),
        title: body.title,
        slug: body.slug,
        summary: body.summary || '',
        content: body.content || '',
        year: body.year || new Date().getFullYear(),
        facts: body.facts || {},
        heroImagePath: body.heroImagePath || '',
        isHero: body.isHero || false,
        isPublished: body.isPublished || false,
        publishedAt: body.isPublished ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create project' },
      { status: 500 }
    );
  }
}
