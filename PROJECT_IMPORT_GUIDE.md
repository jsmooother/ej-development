# 📸 Project Import & Upload System

## Overview

Two ways to add images to your projects:

1. **Admin UI Upload** - Upload images directly through the admin panel
2. **Bulk Import Script** - Import entire projects from local folders (great for multiple projects with many images)

---

## Method 1: Admin UI Upload (Available Now!)

### In the Admin Panel:

1. Go to `/admin/projects/new` or `/admin/projects/[id]`
2. In the "Hero Image" section, you'll see three options:

   **Option A: Upload from Computer**
   - Click the upload zone
   - Select an image from your computer
   - Automatic upload to Supabase Storage
   - Image URL auto-populated

   **Option B: Use Image URL**
   - Paste any image URL
   - Great for Unsplash, external URLs

   **Option C: Quick Select**
   - Click "Show quick select images"
   - Choose from 8 curated presets
   - One-click selection

---

## Method 2: Bulk Import from Folders (For Multiple Projects)

### Perfect for importing many projects with lots of images!

### Setup:

1. **Create the import directory:**
   ```bash
   mkdir -p project-images
   ```

2. **Organize your project folders:**
   ```
   project-images/
   ├── villa-serenidad/
   │   ├── hero.jpg           ← Main image
   │   ├── before-1.jpg       ← Before renovation
   │   ├── before-2.jpg
   │   ├── after-1.jpg        ← After renovation  
   │   ├── after-2.jpg
   │   ├── gallery-1.jpg      ← Gallery images
   │   ├── gallery-2.jpg
   │   ├── gallery-3.jpg
   │   └── project.json       ← Optional metadata
   │
   ├── finca-moderna/
   │   ├── hero.jpg
   │   ├── gallery-1.jpg
   │   └── project.json
   │
   └── coastal-refuge/
       └── ...
   ```

### File Naming Convention:

- `hero.*` → Main project image (hero image)
- `before-*.*` → Before renovation photos
- `after-*.*` → After renovation photos
- `gallery-*.*` → Additional gallery images
- `project.json` → Optional project metadata

### Project Metadata (project.json):

```json
{
  "title": "Villa Serenidad",
  "slug": "villa-serenidad",
  "summary": "La Zagaleta · 2024 - Complete transformation of a 1990s villa",
  "content": "Full project description here...",
  "year": 2024,
  "facts": {
    "sqm": 485,
    "plot": 2400,
    "bedrooms": 5,
    "bathrooms": 4,
    "parking": 3
  },
  "isPublished": true,
  "isHero": false,
  "isComingSoon": false
}
```

**If no `project.json` is provided**, the script will:
- Use folder name as slug
- Auto-generate title from folder name
- Create basic metadata

### Run the Import:

```bash
npm run import-projects
```

### What It Does:

1. ✅ Scans all folders in `/project-images/`
2. ✅ Uploads all images to Supabase Storage
3. ✅ Creates/updates projects in database
4. ✅ Automatically categorizes images (hero, before, after, gallery)
5. ✅ Sets hero image URL in project
6. ✅ Preserves existing projects (updates if slug matches)

### Output Example:

```
🚀 Starting Project Import...

Found 3 project folder(s):
  - villa-serenidad
  - finca-moderna
  - coastal-refuge

📂 Processing: villa-serenidad
   Found 8 files
   ✓ Found project.json
   📤 Uploading: hero.jpg
      → Set as hero image
   📤 Uploading: before-1.jpg
      → Added to before images
   📤 Uploading: after-1.jpg
      → Added to after images
   📤 Uploading: gallery-1.jpg
      → Added to gallery
   ✅ Created project: Villa Serenidad
   📊 Stats:
      Hero image: ✓
      Gallery: 3 images
      Before: 2 images
      After: 2 images

✅ Import complete!
```

---

## Image Guidelines

### Recommended Sizes:
- **Hero Images:** 1920x1080px or higher
- **Gallery Images:** 1200x800px or higher  
- **Before/After:** 1200x800px (same aspect ratio for comparison)

### Supported Formats:
- JPG/JPEG
- PNG
- WebP
- GIF

### File Size Limits:
- **Per file:** 10MB max
- **Recommended:** Under 5MB (will load faster)

---

## Storage Structure

Images are stored in Supabase Storage:

```
Bucket: project-images/
├── projects/              (admin UI uploads)
│   └── timestamp-filename.jpg
│
├── villa-serenidad/       (bulk imports)
│   ├── hero.jpg
│   ├── before-1.jpg
│   └── gallery-1.jpg
│
└── finca-moderna/
    └── ...
```

---

## Next Steps

1. **Set up Supabase Storage Bucket:**
   - Go to Supabase Dashboard → Storage
   - Create bucket: `project-images`
   - Make it public
   - Enable RLS policies

2. **Add your project images:**
   - Create `project-images` folder
   - Add your project folders
   - Add images with proper naming

3. **Run the import:**
   ```bash
   npm run import-projects
   ```

4. **Verify in admin:**
   - Go to `/admin/projects`
   - Check all projects are created
   - Images should be visible

---

## Troubleshooting

**Upload fails in admin UI:**
- Check Supabase bucket exists and is public
- Verify env variables are set
- Check browser console for errors

**Import script fails:**
- Ensure `project-images` directory exists
- Check image file formats
- Verify Supabase credentials in `.env.local`

**Images don't display:**
- Check Supabase Storage bucket is public
- Verify URLs in database are correct
- Check Next.js image config allows Supabase domains

---

## Benefits

✅ **Batch Processing** - Import 100+ images in one go
✅ **Organized** - Keep projects in separate folders
✅ **Flexible** - Mix uploaded + URL images
✅ **Automated** - Script handles everything
✅ **Safe** - Won't duplicate if slug already exists (will update)

Ready to start importing your projects! 🚀

