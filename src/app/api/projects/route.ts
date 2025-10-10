import { NextResponse } from 'next/server';
import { projects } from '@/lib/db/schema';
import { getDb } from '@/lib/db/index';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch all projects using proper query builder
    const allProjects = await db.query.projects.findMany({
      columns: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true,
        year: true,
        facts: true,
        heroImagePath: true,
        isHero: true,
        isComingSoon: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });
    
    console.log('📊 Projects API:', {
      count: allProjects.length,
      projects: allProjects.map(p => ({
        id: p.id,
        title: p.title,
        isPublished: p.isPublished,
        isHero: p.isHero,
        isComingSoon: p.isComingSoon
      }))
    });
    
    // Return array directly for frontend compatibility
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

