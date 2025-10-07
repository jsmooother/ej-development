# Admin Dashboard User Guide

Complete guide for managing content on the EJ Development website.

## Table of Contents
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Managing Blog Posts](#managing-blog-posts)
- [Managing Properties](#managing-properties)
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
1. Add your first blog post
2. Add property listings
3. Connect Instagram feed
4. Review and update the About section (in code)
5. Test all content displays correctly on the homepage

---

## Dashboard Overview

After logging in, you'll see three main sections:

### 📝 Blog Posts
Manage editorial content and articles for your website.

### 🏠 Properties
Manage property listings with images, details, and descriptions.

### 📸 Instagram
Curate your Instagram feed display.

Click any card to manage that content type.

---

## Managing Blog Posts

### Creating a New Blog Post

1. Click **Blog Posts** from the dashboard
2. Click **NEW POST** button (top right)
3. Fill in the form:

#### Required Fields

**Category**
- Use UPPERCASE text (e.g., `DESIGN`, `LIFESTYLE`, `INSIGHTS`)
- Keep it short and descriptive
- Examples: `DESIGN`, `SUSTAINABILITY`, `CRAFTSMANSHIP`, `CULTURE`

**Title**
- Use title case
- Keep under 80 characters for best display
- Make it engaging and descriptive

**Excerpt**
- Brief summary of the post (2-3 sentences)
- This appears on the homepage
- Keep under 200 characters

**Image URL**
- Full URL to the image
- Recommended size: 1200x900px or larger
- Use high-quality images
- Supported sources: Unsplash, direct image URLs

**Content** (Optional)
- Full article content
- Currently displayed on detail pages (if implemented)
- Can include paragraphs and line breaks

**Published**
- ✅ Checked: Post appears on homepage
- ❌ Unchecked: Post saved as draft

4. Click **CREATE**

### Editing a Blog Post

1. Find the post in the list
2. Click **EDIT** button
3. Modify any fields
4. Click **UPDATE**

### Deleting a Blog Post

1. Find the post in the list
2. Click **DELETE** button
3. Confirm deletion (this cannot be undone!)

### Blog Post Display

- Up to 6 most recent published posts appear on the homepage
- Posts are arranged in a masonry grid layout
- Each post shows: category tag, title, excerpt, and image
- Clicking a post navigates to `/blog/[post-id]` (detail page)

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

## Managing Instagram Feed

The Instagram feed shows your recent posts in a grid at the bottom of the homepage.

### Adding an Instagram Post

1. Click **Instagram** from the dashboard
2. Click **NEW POST** button
3. Fill in all required fields:

**Image URL**
- Direct link to the Instagram image
- High-quality, square images (1:1 ratio) work best
- Example: Download from Instagram or use screenshot

**Instagram URL**
- Full Instagram post URL
- Format: `https://instagram.com/p/POST_ID`
- Example: `https://instagram.com/p/ABC123xyz`

**Caption**
- Short description of the post
- This helps with accessibility
- Not displayed publicly but used for alt text

4. Click **CREATE**

### Deleting an Instagram Post

1. Find the post in the grid
2. Click **DELETE** button
3. Confirm deletion

### Instagram Feed Display

- Up to 6 most recent posts shown on homepage
- Displayed in a 2-3-6 column grid (responsive)
- Clicking an image opens the Instagram post
- Hover effects add interactivity

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

