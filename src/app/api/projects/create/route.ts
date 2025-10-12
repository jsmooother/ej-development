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
    
    console.log('📊 Creating project with data:', {
      title: body.title,
      projectImagesCount: body.projectImages?.length || 0,
      imagePairsCount: body.imagePairs?.length || 0,
      hasProjectImages: Array.isArray(body.projectImages),
      hasImagePairs: Array.isArray(body.imagePairs),
    });
    
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
        projectImages: body.projectImages || [],
        imagePairs: body.imagePairs || [],
        isHero: body.isHero || false,
        isPublished: body.isPublished || false,
        publishedAt: body.isPublished ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    console.log('✅ Project created successfully:', {
      id: newProject[0].id,
      title: newProject[0].title,
      projectImagesStored: newProject[0].projectImages?.length || 0,
      imagePairsStored: newProject[0].imagePairs?.length || 0,
    });
    
    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create project' },
      { status: 500 }
    );
  }
}
