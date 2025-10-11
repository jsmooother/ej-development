import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { instagramSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Instagram OAuth Callback Handler
 * 
 * This handles the callback from Instagram after user authorization.
 * Flow:
 * 1. User clicks "Connect Instagram" in admin
 * 2. Redirected to Instagram authorization
 * 3. Instagram redirects back here with a code
 * 4. Exchange code for access token
 * 5. Store token and fetch user info
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorReason = searchParams.get("error_reason");
  const errorDescription = searchParams.get("error_description");

  // Handle authorization denial
  if (error) {
    console.error("Instagram OAuth error:", {
      error,
      errorReason,
      errorDescription,
    });
    return NextResponse.redirect(
      new URL(
        `/admin/instagram?error=${encodeURIComponent(errorDescription || "Authorization failed")}`,
        request.url
      )
    );
  }

  // Validate code parameter
  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/admin/instagram?error=No authorization code received",
        request.url
      )
    );
  }

  try {
    // Get environment variables
    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/instagram/callback`;

    if (!appId || !appSecret) {
      throw new Error("Instagram app credentials not configured");
    }

    // Step 1: Exchange short-lived code for short-lived access token
    const tokenUrl = "https://api.instagram.com/oauth/access_token";
    const tokenFormData = new FormData();
    tokenFormData.append("client_id", appId);
    tokenFormData.append("client_secret", appSecret);
    tokenFormData.append("grant_type", "authorization_code");
    tokenFormData.append("redirect_uri", redirectUri);
    tokenFormData.append("code", code);

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      body: tokenFormData,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token: shortLivedToken, user_id } = tokenData;

    // Step 2: Exchange short-lived token for long-lived token (60 days)
    const longLivedUrl = new URL("https://graph.instagram.com/access_token");
    longLivedUrl.searchParams.append("grant_type", "ig_exchange_token");
    longLivedUrl.searchParams.append("client_secret", appSecret);
    longLivedUrl.searchParams.append("access_token", shortLivedToken);

    const longLivedResponse = await fetch(longLivedUrl.toString());
    
    if (!longLivedResponse.ok) {
      const errorData = await longLivedResponse.json();
      throw new Error(`Long-lived token exchange failed: ${JSON.stringify(errorData)}`);
    }

    const longLivedData = await longLivedResponse.json();
    const { access_token: longLivedToken, expires_in } = longLivedData;

    // Calculate token expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Step 3: Fetch user profile information
    const profileUrl = new URL("https://graph.instagram.com/me");
    profileUrl.searchParams.append("fields", "id,username,account_type,media_count");
    profileUrl.searchParams.append("access_token", longLivedToken);

    const profileResponse = await fetch(profileUrl.toString());
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      throw new Error(`Failed to fetch profile: ${JSON.stringify(errorData)}`);
    }

    const profileData = await profileResponse.json();
    const { username } = profileData;

    // Step 4: Store in database
    const db = getDb();

    // Check if settings already exist
    const existing = await db.select().from(instagramSettings).limit(1);

    const settingsData = {
      username,
      accessToken: longLivedToken,
      tokenExpiresAt: expiresAt,
      userId: user_id.toString(),
      isConnected: true,
      lastSync: null,
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      // Update existing settings
      await db
        .update(instagramSettings)
        .set(settingsData)
        .where(eq(instagramSettings.id, existing[0].id));
    } else {
      // Insert new settings
      await db.insert(instagramSettings).values(settingsData);
    }

    console.log("✅ Instagram connected successfully:", {
      username,
      userId: user_id,
      expiresAt: expiresAt.toISOString(),
    });

    // Redirect back to admin page with success
    return NextResponse.redirect(
      new URL("/admin/instagram?success=connected", request.url)
    );
  } catch (error) {
    console.error("❌ Instagram OAuth callback error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/admin/instagram?error=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
}

