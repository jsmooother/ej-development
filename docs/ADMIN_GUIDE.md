# Admin Dashboard User Guide

Complete guide for managing content on the EJ Development website.

## Table of Contents
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Managing Editorials](#managing-editorials)
- [Managing Properties](#managing-properties)
- [Managing Projects](#managing-projects)
- [Managing Instagram Feed](#managing-instagram-feed)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Dashboard

1. Open your browser
2. Navigate to `/admin` (e.g., `https://yoursite.com/admin`)
3. Enter your credentials:
   - **Username**: `admin`
   - **Password**: `admin123` (or your custom password)
4. Click **Login**

### First-Time Setup

After logging in for the first time:
1. Add your first editorial
2. Add property listings
3. Connect Instagram feed
4. Review and update the About section (in code)
5. Test all content displays correctly on the homepage

---

## Dashboard Overview

After logging in, you'll see three main sections:

### 📝 Editorials
Manage editorial content and articles for your website. Use the AI assistant to draft pieces quickly.

### 🏠 Properties
Manage property listings with images, details, and descriptions.

### 📸 Instagram
Curate your Instagram feed display.

Click any card to manage that content type.

---

## Managing Editorials

### Creating a New Editorial

1. Click **Editorials** from the dashboard
2. Click **CREATE EDITORIAL** (top right)
3. Fill in the form:

#### Required Fields

**Category tag**
- Keep it short (e.g., `Market Insight`, `Design Journal`)
- This renders as the badge on the homepage card

**Title**
- Aim for 60–80 characters
- Use editorial tone, title case recommended

**Excerpt**
- 1–2 sentences (max 220 characters)
- Appears on the homepage stream beneath the title

**Body copy**
- Three short paragraphs read best in the detail view
- You can paste formatted text—line breaks are preserved

**Primary image URL**
- Full URL to the lead image (1200px wide or greater)
- Supabase Storage paths are also accepted

**Publish toggle**
- ✅ Checked: Editorial surfaces on the homepage
- ❌ Unchecked: Saved as draft for later

4. Click **SAVE EDITORIAL**

### Using the AI Draft Assistant

1. Scroll to **Generate with AI**
2. Enter a topic, desired tone, and keywords
3. Click **Draft with AI**
4. Review the generated title, excerpt, body, and creative prompts
5. Paste the suggested image prompts into Midjourney, DALL·E, or Sora as needed

> **Note:** An OpenAI API key must be configured in the environment for this feature. If unavailable, the assistant will explain what is missing.

### Editorial Display

- The six most recent published editorials appear in rotation with projects on the homepage
- Cards show the category tag, title, and excerpt
- Clicking a card navigates to the editorial detail page once implemented

---

## Managing Properties

### Adding a New Property

1. Click **Properties** from the dashboard
2. Click **NEW PROPERTY** button
3. Fill in the form:

#### Required Fields

**Size**
- Format: `XXX m²`
- Example: `246 m²`, `187 m²`
- Use the ² symbol for square meters

**Rooms**
- Format: `X rum` (Swedish for rooms)
- Example: `5 rum`, `4 rum`
- Or use English: `5 rooms`

**Image URL**
- Full URL to property image
- Recommended size: 1200x900px or larger
- High-quality exterior/interior photos work best

#### Optional Fields

**Location**
- City or area name
- Example: `Marbella`, `Puerto Banús`, `Sierra Blanca`

**Price**
- Format as desired
- Examples: `€2,500,000`, `€2.5M`, `POA` (Price on Application)

**Description**
- Detailed property description
- Include key features, amenities, views
- Multiple paragraphs supported

**Published**
- ✅ Checked: Property appears on homepage
- ❌ Unchecked: Property hidden from public view

4. Click **CREATE**

### Property Display

- Up to 6 properties appear on homepage
- Mixed into the masonry grid with blog posts
- Size and rooms overlaid on bottom right of images
- Hover effects for interactivity

---

## Managing Projects

Projects power the "Portfolio & Editorial" stream and require both hero and transformation imagery.

### Adding a New Project

1. Click **Projects** from the dashboard
2. Click **ADD PROJECT**
3. Complete the form:

#### Core Details

**Title & Summary**
- Title appears on the homepage card
- Summary should be 1–2 sentences describing the concept

**Location & Year**
- Use the format `Neighbourhood · Year` for consistency (e.g., `Sierra Blanca · 2024`)
- Year is optional but helps with chronological filtering later

**Full Description**
- Optional longer copy for the forthcoming project detail page
- Use paragraphs to describe phases, materials, and partners

#### Imagery

**Hero image**
- Required
- Landscape orientation works best (min 1400px wide)
- The hero image is also stored in the gallery with the `hero` tag

**Before image**
- Optional but recommended
- Shows the property before renovation
- You can add an optional caption for context

**After image**
- Optional but recommended to highlight transformation
- Add a caption to describe the update

> Tip: Upload images to Supabase Storage or paste full CDN URLs.

#### Publish Toggle

- ✅ Checked: Project appears on the homepage stream
- ❌ Unchecked: Keeps the project hidden while drafting

4. Click **SAVE PROJECT**

### Project Display

- Published projects interleave with editorials on the homepage grid
- Before/after pairs allow future compare sliders and timeline modules
- Additional gallery slots will be added in subsequent iterations

---

## Managing Instagram Feed

The Instagram feed now refreshes automatically from the official API.

### Connecting Instagram

1. Click **Instagram** from the dashboard
2. Paste your **Instagram username**
3. Paste a **long-lived access token** generated via Meta's Graph API tools
4. Click **SAVE SETTINGS**

> The token is stored securely in Supabase. Rotate it whenever Meta prompts you to refresh permissions.

### Refreshing the Feed

- The system caches the last API response to avoid rate limits
- Use **Clear cache** to force a refresh (e.g., after posting new content)
- The dashboard shows when the feed was last refreshed

### Roadmap

- Manual pinning of favourite posts
- Auto-syncing Sora reels into the hero slot
- Scheduling quiet hours to respect API limits

---

## Best Practices

### Images

**Optimization**
- Compress images before uploading
- Use WebP format when possible
- Recommended tools: TinyPNG, Squoosh, Cloudinary

**Sizing**
- Blog posts: 1200x900px (4:3 ratio)
- Properties: 1200x900px or 1200x1600px (tall)
- Instagram: 1080x1080px (1:1 square)

**Hosting**
- Use reliable image hosting
- Options: Unsplash (free), Cloudinary, AWS S3, Imgur
- Ensure HTTPS URLs

### Content Strategy

**Blog Posts**
- Publish regularly (weekly recommended)
- Mix categories to keep content diverse
- Use high-quality, relevant images
- Write engaging titles and excerpts
- Keep excerpts concise and enticing

**Properties**
- Update regularly as listings change
- Use professional photography
- Include detailed descriptions
- Specify location and price clearly
- Mark as unpublished when sold/unavailable

**Instagram Feed**
- Update weekly or after each Instagram post
- Showcase best/recent content
- Mix property photos with lifestyle shots
- Keep feed visually cohesive

### SEO Tips

- Use descriptive titles (include keywords)
- Write unique excerpts for each post
- Include location names in property descriptions
- Use alt text (captions) for all images

---

## Keyboard Shortcuts

When editing content:
- `Tab` - Navigate between fields
- `Shift + Tab` - Navigate backwards
- `Enter` - Submit form (when focused on input)
- `Escape` - Cancel/Close form

---

## Content Workflow

### Recommended Publishing Process

1. **Draft Phase**
   - Create content with `Published` unchecked
   - Review privately
   - Check image loads correctly
   - Proofread text

2. **Review Phase**
   - Preview on homepage (if published)
   - Check mobile view
   - Verify all links work
   - Test on different browsers

3. **Publish Phase**
   - Check `Published` checkbox
   - Update to make live
   - Verify appears on homepage
   - Share on social media

4. **Maintenance**
   - Update outdated content
   - Remove old/sold properties
   - Archive old blog posts if needed
   - Refresh Instagram feed regularly

---

## Troubleshooting

### Can't Log In

**Solution:**
- Verify username/password are correct
- Check caps lock is off
- Clear browser cache and cookies
- Try incognito/private browsing mode

### Image Not Displaying

**Possible Causes:**
- Broken image URL
- Image host blocking hotlinking
- HTTPS/HTTP mismatch

**Solution:**
- Verify URL is correct and accessible
- Use image hosting that allows embedding
- Ensure URL starts with `https://`

### Changes Not Appearing on Homepage

**Solution:**
- Ensure `Published` is checked
- Refresh the homepage (hard refresh: Cmd/Ctrl + Shift + R)
- Check browser cache
- Wait a few seconds for database to update

### Form Not Submitting

**Solution:**
- Check all required fields are filled
- Verify image URLs are valid
- Check browser console for errors
- Try refreshing the page and submitting again

### Accidentally Deleted Content

⚠️ **Deletions are permanent!**

If you accidentally deleted something:
- There is no undo feature
- You must re-create the content manually
- Consider taking regular backups

---

## Security

### Password Best Practices

- Use a strong, unique password
- Don't share credentials
- Change password regularly
- Log out when finished

### Session Management

- Sessions expire after closing browser
- You'll need to log in again
- Don't use admin on public computers
- Always log out when done

---

## Mobile Usage

The admin dashboard works on mobile devices:

- Use landscape orientation for better view
- Forms are touch-friendly
- Pinch to zoom if needed
- Some features easier on desktop

---

## Getting Help

If you encounter issues:

1. **Check this guide** - Most questions answered here
2. **Try troubleshooting steps** - Common fixes provided
3. **Contact support** - Reach out to your developer
4. **Check browser console** - Press F12 for technical errors

---

## Tips for Success

✅ **DO:**
- Save drafts before publishing
- Use high-quality images
- Keep categories consistent
- Write clear, concise content
- Update regularly
- Test on mobile
- Back up important content elsewhere

❌ **DON'T:**
- Delete content hastily
- Use copyrighted images without permission
- Leave forms partially filled
- Publish without reviewing
- Use very large image files (>5MB)
- Share admin credentials

---

## Quick Reference

### Character Limits

| Field | Recommended Max |
|-------|----------------|
| Blog Title | 80 characters |
| Blog Excerpt | 200 characters |
| Category | 20 characters |
| Property Size | 15 characters |
| Property Rooms | 10 characters |
| Property Location | 50 characters |

### Image Sizes

| Type | Dimensions | Aspect Ratio |
|------|------------|--------------|
| Blog Post | 1200x900px | 4:3 |
| Property (standard) | 1200x900px | 4:3 |
| Property (tall) | 1200x1600px | 3:4 |
| Instagram | 1080x1080px | 1:1 |

### Publishing Checklist

- [ ] All required fields filled
- [ ] Image URL valid and loads
- [ ] Text proofread
- [ ] Preview looks good
- [ ] Mobile view checked
- [ ] Published checkbox set correctly
- [ ] Content saved successfully

---

**Need more help?** Contact your website administrator or developer.

**Version:** 1.0  
**Last Updated:** January 2025

