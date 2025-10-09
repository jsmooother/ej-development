import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';

export async function GET() {
  try {
    const db = await getDb();
    
    // Fetch all editorials (posts) from the database
    const editorials = await db.query.posts.findMany({
      columns: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImagePath: true,
        tags: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return NextResponse.json(editorials);
  } catch (error) {
    console.error('Error fetching editorials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch editorials' },
      { status: 500 }
    );
  }
}
