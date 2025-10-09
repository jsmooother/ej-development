import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { instagramCache } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch Instagram posts from cache
    const posts = await db
      .select()
      .from(instagramCache)
      .orderBy(desc(instagramCache.timestamp))
      .limit(12);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { posts: newPosts } = await request.json();
    
    if (!Array.isArray(newPosts)) {
      return NextResponse.json(
        { error: 'Posts must be an array' },
        { status: 400 }
      );
    }
    
    // Clear existing cache
    await db.delete(instagramCache);
    
    // Insert new posts
    const insertedPosts = await db
      .insert(instagramCache)
      .values(
        newPosts.map((post: any) => ({
          id: post.id,
          mediaUrl: post.mediaUrl,
          permalink: post.permalink,
          caption: post.caption || '',
          mediaType: post.mediaType || 'IMAGE',
          timestamp: post.timestamp || new Date().toISOString(),
        }))
      )
      .returning();
    
    return NextResponse.json({
      success: true,
      count: insertedPosts.length,
      posts: insertedPosts,
    });
  } catch (error) {
    console.error('Error updating Instagram cache:', error);
    return NextResponse.json(
      { error: 'Failed to update Instagram cache' },
      { status: 500 }
    );
  }
}

