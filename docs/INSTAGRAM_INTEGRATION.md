# Instagram Integration Guide

This guide explains how to connect your Instagram account to your website using Instagram Basic Display API.

## Overview

The Instagram integration allows you to:
- Connect your Instagram account via OAuth 2.0
- Automatically sync your recent Instagram posts
- Display posts on your website's Instagram page
- Manage syncing from the admin panel

## Prerequisites

- An Instagram account (must be a Creator or Business account for best results)
- A Facebook Developer account
- Your website must be accessible via HTTPS (Instagram requires secure callback URLs)

## Setup Steps

### 1. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** as the app type
4. Fill in your app details:
   - **App Name**: `[Your Website Name] Instagram Feed`
   - **Contact Email**: Your email address
5. Click **"Create App"**

### 2. Add Instagram Basic Display

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** in the Instagram Basic Display settings
4. Fill in the required fields:
   - **Display Name**: `[Your Website Name]`
   - **Valid OAuth Redirect URIs**: Add your callback URL:
     ```
     https://yourdomain.com/api/instagram/callback
     ```
     For local development:
     ```
     http://localhost:3000/api/instagram/callback
     ```
   - **Deauthorize Callback URL**: Same as redirect URI
   - **Data Deletion Request URL**: Same as redirect URI
5. Click **"Save Changes"**

### 3. Add Instagram Test User

1. Scroll down to **"User Token Generator"**
2. Click **"Add or Remove Instagram Testers"**
3. This will open Instagram in a new tab
4. Add your Instagram account as a tester
5. Go to your Instagram account settings → Apps and Websites → Tester Invites
6. Accept the tester invitation

### 4. Get Your App Credentials

1. Go back to your Facebook App dashboard
2. Navigate to **Settings** → **Basic**
3. Copy your **App ID** and **App Secret**

### 5. Configure Environment Variables

Add the following variables to your `.env.local` file:

```env
# Instagram Basic Display API
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/instagram/callback

# Public variables (needed for OAuth flow)
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_app_id_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important Notes:**
- Replace `your_app_id_here` with your actual App ID
- Replace `your_app_secret_here` with your actual App Secret
- Replace `https://yourdomain.com` with your actual domain
- For local development, use `http://localhost:3000`
- Keep your App Secret private - never commit it to version control

### 6. Connect Instagram in Admin Panel

1. Navigate to your admin panel: `/admin/instagram`
2. Click **"Connect Instagram"**
3. You'll be redirected to Instagram to authorize the connection
4. Click **"Allow"** to grant permissions
5. You'll be redirected back to your admin panel
6. Click **"Sync Now"** to fetch your recent posts

## Features

### OAuth 2.0 Authentication
- Secure authorization flow
- Long-lived access tokens (60 days)
- Automatic token refresh

### Post Syncing
- Fetches up to 25 recent posts
- Supports images, videos, and carousel albums
- Stores posts in your database for fast loading
- Manual sync button in admin panel

### Token Management
- Access tokens automatically refresh before expiration
- Expiration warnings in admin panel
- Easy reconnection if token expires

### Data Storage
- Posts cached in database
- Settings stored securely
- No sensitive data exposed to frontend

## API Endpoints

### `/api/instagram/callback` (GET)
Handles OAuth callback from Instagram. Exchanges authorization code for access token.

### `/api/instagram/sync` (POST)
Syncs posts from Instagram API to your database.

**Response:**
```json
{
  "message": "Successfully synced Instagram posts",
  "count": 25,
  "posts": [...]
}
```

### `/api/instagram/sync` (GET)
Gets current Instagram connection status.

**Response:**
```json
{
  "isConnected": true,
  "username": "your_username",
  "lastSync": "2024-10-11T12:00:00.000Z",
  "tokenExpiresAt": "2024-12-10T12:00:00.000Z",
  "tokenExpired": false
}
```

### `/api/instagram/posts` (GET)
Returns cached Instagram posts from database.

**Response:**
```json
[
  {
    "id": "instagram_post_id",
    "mediaUrl": "https://...",
    "thumbnailUrl": "https://...",
    "permalink": "https://instagram.com/p/...",
    "caption": "Post caption",
    "mediaType": "IMAGE",
    "timestamp": "2024-10-11T12:00:00.000Z"
  }
]
```

## Database Schema

### `instagram_settings` Table
Stores Instagram connection settings and tokens.

```typescript
{
  id: string;
  username: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  userId: string | null;
  isConnected: boolean;
  autoSync: boolean;
  syncInterval: number;
  lastSync: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### `instagram_cache` Table
Stores fetched Instagram posts.

```typescript
{
  id: string;
  fetchedAt: Date;
  payload: InstagramPost[];
}
```

## Troubleshooting

### "Instagram not connected" Error
- Make sure you've completed the OAuth flow
- Check that your App ID is correct in environment variables
- Verify the redirect URI matches exactly in Facebook app settings

### "Access token expired" Error
- Click "Connect Instagram" again to get a new token
- Make sure `INSTAGRAM_APP_SECRET` is set correctly for token refresh

### Posts Not Syncing
- Check that your Instagram account accepted the tester invitation
- Verify your Instagram account has posts
- Check browser console and server logs for error messages

### OAuth Redirect Not Working
- Ensure `INSTAGRAM_REDIRECT_URI` matches your callback URL exactly
- Check that the URL is added to **Valid OAuth Redirect URIs** in Facebook app settings
- Make sure the URL uses HTTPS (or HTTP for localhost)

### "Invalid Client ID" Error
- Double-check `INSTAGRAM_APP_ID` is correct
- Ensure `NEXT_PUBLIC_INSTAGRAM_APP_ID` is also set
- Restart your development server after adding environment variables

## Security Best Practices

1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Use HTTPS**: Instagram requires secure connections for production
3. **Rotate tokens**: Tokens automatically expire after 60 days
4. **Limit permissions**: Only request necessary Instagram permissions
5. **Validate data**: Always validate Instagram API responses

## Rate Limits

Instagram Basic Display API has the following rate limits:
- **200 requests per hour** per access token
- **20 requests per minute** per app

The integration caches posts in your database to minimize API calls.

## Support

For more information:
- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook App Development](https://developers.facebook.com/docs/development)
- [OAuth 2.0 Overview](https://oauth.net/2/)

## Future Enhancements

Potential features for future releases:
- Automatic sync on a schedule (cron job)
- Webhook integration for real-time updates
- Post filtering and management
- Instagram Stories support (requires Instagram Graph API)
- Analytics and insights

