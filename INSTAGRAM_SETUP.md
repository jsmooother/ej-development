# Instagram Setup Quick Start

## ✅ What's Been Configured

1. **Database**: `instagram_settings` table created and migrated
2. **Environment Variables**: Placeholders added to `.env.local`
3. **API Routes**: OAuth callback and sync endpoints ready
4. **Admin UI**: `/admin/instagram` page with connect/sync functionality

## 🔑 Your .env.local File

The following placeholders have been added:

```env
# Instagram Basic Display API
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
NEXT_PUBLIC_INSTAGRAM_APP_ID=
```

## 📝 Next Steps to Connect Instagram

### 1. Create Facebook App
Visit: https://developers.facebook.com/

1. Click "My Apps" → "Create App"
2. Choose "Consumer" type
3. Name it something like "Your Website Instagram Feed"
4. Save your app

### 2. Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" in Instagram settings
4. Fill in:
   - **Display Name**: Your website name
   - **Valid OAuth Redirect URIs**: 
     ```
     http://localhost:3000/api/instagram/callback
     https://yourdomain.com/api/instagram/callback
     ```
   - **Deauthorize Callback URL**: Same as above
   - **Data Deletion Request URL**: Same as above
5. Save changes

### 3. Get Your Credentials
1. Go to Settings → Basic in your Facebook app
2. Copy your **App ID** and **App Secret**

### 4. Update .env.local
Replace the empty values in `.env.local`:

```env
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_app_id_here
```

### 5. Add Test User
1. In Facebook app, go to Instagram Basic Display settings
2. Click "Add or Remove Instagram Testers"
3. Add your Instagram username
4. Open Instagram app → Settings → Apps and Websites → Tester Invites
5. Accept the invitation

### 6. Connect!
1. **Restart your dev server** (important after adding env variables)
2. Navigate to http://localhost:3000/admin/instagram
3. Click "Connect Instagram"
4. Authorize the app
5. Click "Sync Now" to fetch your posts

## 🔒 Security Notes

- Keep `INSTAGRAM_APP_SECRET` private
- Never commit `.env.local` to version control
- For production, use HTTPS URLs only
- Tokens auto-refresh every 60 days

## 📚 Full Documentation

See `docs/INSTAGRAM_INTEGRATION.md` for complete setup guide and troubleshooting.

---

**Current Status**: Server running at http://localhost:3000 ✅

