import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { instagramSettings, instagramCache } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cacheInstagramPosts, getCachedInstagramPosts, clearInstagramCache } from "@/lib/cache/redis";

interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Instagram Media Sync API
 * 
 * Fetches recent media from Instagram Basic Display API and stores in database.
 * Uses Redis caching to reduce API calls and improve performance.
 * Requires active Instagram connection with valid access token.
 */
export async function POST() {
  try {
    const db = getDb();

    // Check cache first
    const cachedPosts = await getCachedInstagramPosts();
    if (cachedPosts && cachedPosts.length > 0) {
      console.log(`📦 Returning ${cachedPosts.length} cached Instagram posts`);
      return NextResponse.json({ 
        success: true, 
        posts: cachedPosts,
        cached: true,
        count: cachedPosts.length 
      });
    }

    // Get Instagram settings
    const settings = await db.select().from(instagramSettings).limit(1);

    if (settings.length === 0 || !settings[0].isConnected) {
      return NextResponse.json(
        { error: "Instagram not connected" },
        { status: 400 }
      );
    }

    const { accessToken, tokenExpiresAt } = settings[0];

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token available" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
      // Try to refresh the token
      const refreshed = await refreshAccessToken(accessToken, settings[0].id);
      if (!refreshed) {
        return NextResponse.json(
          { error: "Access token expired and refresh failed. Please reconnect Instagram." },
          { status: 401 }
        );
      }
      // Use the new token
      const newSettings = await db.select().from(instagramSettings).limit(1);
      return syncMedia(newSettings[0].accessToken!);
    }

    return syncMedia(accessToken);
  } catch (error) {
    console.error("❌ Instagram sync error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to sync Instagram: ${errorMessage}` },
      { status: 500 }
    );
  }
}

async function syncMedia(accessToken: string) {
  try {
    // Fetch user's recent media from Instagram Graph API
    const mediaUrl = new URL("https://graph.instagram.com/me/media");
    mediaUrl.searchParams.append("fields", "id,media_type,media_url,permalink,caption,timestamp,thumbnail_url");
    mediaUrl.searchParams.append("access_token", accessToken);
    mediaUrl.searchParams.append("limit", "25"); // Fetch last 25 posts

    console.log("🔄 Fetching Instagram media...");
    
    const response = await fetch(mediaUrl.toString());

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Instagram API error: ${JSON.stringify(errorData)}`);
    }

    const data: InstagramMediaResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({
        message: "No posts found",
        count: 0,
      });
    }

    const db = getDb();

    // Transform Instagram posts to our format
    const posts = data.data.map((item) => ({
      id: item.id,
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url,
      permalink: item.permalink,
      caption: item.caption || "",
      mediaType: item.media_type,
      timestamp: item.timestamp,
    }));

    // Store all posts as a single cache entry
    // Clear old cache entries first
    await db.delete(instagramCache);

    // Insert new cache with all posts
    await db.insert(instagramCache).values({
      payload: posts,
      fetchedAt: new Date(),
    });

    // Update last sync time
    await db
      .update(instagramSettings)
      .set({
        lastSync: new Date(),
        updatedAt: new Date(),
      });

    console.log(`✅ Successfully synced ${posts.length} Instagram posts`);

    // Cache the posts for faster future requests
    await cacheInstagramPosts(posts);

    return NextResponse.json({
      message: "Successfully synced Instagram posts",
      count: posts.length,
      posts: posts.slice(0, 6), // Return first 6 for preview
      cached: false,
    });
  } catch (error) {
    console.error("❌ Sync media error:", error);
    throw error;
  }
}

/**
 * Clear Instagram cache
 * Useful for forcing a fresh sync
 */
export async function DELETE() {
  try {
    await clearInstagramCache();
    
    return NextResponse.json({
      message: "Instagram cache cleared successfully",
    });
  } catch (error) {
    console.error("❌ Clear cache error:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}

/**
 * Refresh Instagram Access Token
 * Long-lived tokens last 60 days and can be refreshed
 */
async function refreshAccessToken(currentToken: string, settingsId: string): Promise<boolean> {
  try {
    console.log("🔄 Refreshing Instagram access token...");

    const refreshUrl = new URL("https://graph.instagram.com/refresh_access_token");
    refreshUrl.searchParams.append("grant_type", "ig_refresh_token");
    refreshUrl.searchParams.append("access_token", currentToken);

    const response = await fetch(refreshUrl.toString());

    if (!response.ok) {
      console.error("Failed to refresh token:", await response.text());
      return false;
    }

    const data = await response.json();
    const { access_token: newToken, expires_in } = data;

    // Calculate new expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Update token in database
    const db = getDb();
    await db
      .update(instagramSettings)
      .set({
        accessToken: newToken,
        tokenExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(instagramSettings.id, settingsId));

    console.log("✅ Token refreshed successfully, expires:", expiresAt.toISOString());
    return true;
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    return false;
  }
}

/**
 * GET endpoint to check sync status
 */
export async function GET() {
  try {
    const db = getDb();
    const settings = await db.select().from(instagramSettings).limit(1);

    if (settings.length === 0) {
      return NextResponse.json({
        isConnected: false,
        message: "Instagram not configured",
      });
    }

    const { isConnected, lastSync, username, tokenExpiresAt } = settings[0];

    return NextResponse.json({
      isConnected,
      lastSync,
      username,
      tokenExpiresAt,
      tokenExpired: tokenExpiresAt && new Date(tokenExpiresAt) < new Date(),
    });
  } catch (error) {
    console.error("❌ Sync status error:", error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}

