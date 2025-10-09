import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { instagramCache } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Fetch Instagram posts from cache using raw postgres
    const posts = await db.select().from(instagramCache);
    
    // Sort in JavaScript instead of SQL to avoid reserved word issue
    const sortedPosts = posts.sort((a, b) => {
      const dateA = a.fetchedAt ? new Date(a.fetchedAt).getTime() : 0;
      const dateB = b.fetchedAt ? new Date(b.fetchedAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 12);
    
    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error
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

