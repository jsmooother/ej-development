import { NextResponse } from 'next/server';
import { projects } from '@/lib/db/schema';
import { getDb } from '@/lib/db/index';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    
    return NextResponse.json({
      success: true,
      count: allProjects.length,
      projects: allProjects
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

