# Scripts Documentation

This directory contains production-ready utility scripts for managing the EJ Development platform.

## 📋 Quick Reference

### User Management
- `create-first-admin.ts` - Create the first admin user
- `create-editor-user.ts` - Create editor users

### Content Population
- `create-editorials.ts` - Populate editorial content
- `seed-default-settings.ts` - Setup default site settings
- **`upload-project-images.ts`** - **Main script for uploading project images**

### Verification & Monitoring
- `check-projects.ts` - Verify project data in database
- `check-projects-folder.ts` - Verify storage folder structure
- `test-project-status.ts` - Test draft/live status functionality
- `test-status.sh` - Quick test runner for status functionality

### Emergency/Maintenance
- `clean-slate-image-restructure.ts` - Full reset for images (clears DB + storage)
- `cleanup-by-timestamp.ts` - Smart cleanup of unused files
- `cleanup-storage.ts` - Clear storage bucket
- `simple-reset.ts` - Reset database data

---

## 📖 Detailed Documentation

### User Management Scripts

#### `create-first-admin.ts`
Creates the first admin user for the platform.

**Usage:**
```bash
npx tsx scripts/create-first-admin.ts
```

**What it does:**
- Creates admin user with full permissions
- Sets up authentication
- Grants access to all admin features

#### `create-editor-user.ts`
Creates editor users with limited permissions.

**Usage:**
```bash
npx tsx scripts/create-editor-user.ts
```

**What it does:**
- Creates editor user with restricted permissions
- Cannot access settings or user management
- Can edit content and manage enquiries

---

### Content Population Scripts

#### `create-editorials.ts`
Populates the database with 12 editorial stories.

**Usage:**
```bash
npx tsx scripts/create-editorials.ts
```

**What it does:**
- Creates 12 editorial articles
- 4 about Marbella properties
- 4 about local restaurants/beaches
- 4 about cultural life
- Includes images and SEO-optimized content

#### `seed-default-settings.ts`
Sets up default site settings.

**Usage:**
```bash
npx tsx scripts/seed-default-settings.ts
```

**What it does:**
- Creates default site settings
- Sets up content limits
- Configures basic site parameters

#### `upload-project-images.ts` ⭐
**Main script for uploading project images from local folders.**

**Usage:**
```bash
npx tsx scripts/upload-project-images.ts
```

**Requirements:**
- Images organized in folders: `Desktop/project-folder/Project - {Name}/Before` and `/After`
- Project must exist in database first

**What it does:**
- Uploads images from local `Before` and `After` folders
- Automatically creates before/after pairs (max 8 per project)
- Sets hero image automatically
- Auto-publishes projects with images
- Follows proper naming: `project-slug-timestamp-random.ext`
- Storage path: `/images/projects/{slug}/`

**Supported formats:**
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**Example folder structure:**
```
Desktop/project-folder/
├── Project - Wallin Revival/
│   ├── Before/
│   │   ├── IMG_001.jpg
│   │   └── IMG_002.jpg
│   └── After/
│       ├── IMG_010.jpg
│       └── IMG_011.jpg
├── Project - Grand Celeste/
│   ├── Before/
│   └── After/
└── ...
```

---

### Verification & Monitoring Scripts

#### `check-projects.ts`
Verifies project data in the database.

**Usage:**
```bash
npx tsx scripts/check-projects.ts
```

**What it shows:**
- All projects in database
- Project slugs and IDs
- Publication status
- Image counts
- Pair counts

#### `check-projects-folder.ts`
Verifies storage folder structure and file counts.

**Usage:**
```bash
npx tsx scripts/check-projects-folder.ts
```

**What it shows:**
- All folders in `/images/projects/`
- File counts per project
- Example filenames
- Total storage usage

#### `test-project-status.ts`
Automated test for draft/live project status functionality.

**Usage:**
```bash
# Quick test (uses first project)
./scripts/test-status.sh

# Test specific project
./scripts/test-status.sh [project-id]
```

**What it tests:**
- ✅ Toggling from Live to Draft
- ✅ Toggling from Draft to Live
- ✅ Database updates persist correctly
- ✅ publishedAt timestamp set/cleared correctly
- ✅ Public API filtering works
- ✅ Status restoration
- ✅ Data integrity maintained

**What it shows:**
- Current status of all projects
- Step-by-step test execution
- Verification of each change
- Test summary and results

**Example output:**
```
🧪 Starting Project Status Test
📊 Status Summary:
   • Live: 4 projects
   • Draft: 1 projects
🎯 Testing with: "Project Name"
   Current status: LIVE
✅ All checks passed successfully!
```

---

### Emergency/Maintenance Scripts

#### `clean-slate-image-restructure.ts`
**⚠️ DESTRUCTIVE** - Full reset for images.

**Usage:**
```bash
npx tsx scripts/clean-slate-image-restructure.ts
```

**What it does:**
- Clears all image references from database
- Deletes all images from storage
- Provides clean slate for re-upload

**Use when:**
- Complete image reset needed
- Storage structure needs rebuilding
- Major cleanup required

#### `cleanup-by-timestamp.ts`
Smart cleanup of unused/orphaned files in storage.

**Usage:**
```bash
npx tsx scripts/cleanup-by-timestamp.ts
```

**What it does:**
- Compares storage files with database URLs
- Deletes files not referenced in database
- Keeps all files currently in use
- Safe to run anytime

#### `cleanup-storage.ts`
Clears entire storage bucket.

**Usage:**
```bash
npx tsx scripts/cleanup-storage.ts
```

**What it does:**
- Deletes all files from images bucket
- **Does not touch database**

**⚠️ Warning:** This only clears storage, not database references. Use `clean-slate-image-restructure.ts` for full reset.

#### `simple-reset.ts`
Resets database data (projects, posts, listings).

**Usage:**
```bash
npx tsx scripts/simple-reset.ts
```

**What it does:**
- Deletes all projects
- Deletes all posts/editorials
- Deletes all listings
- **Does not touch storage**

**⚠️ Warning:** This only clears database, not storage. Use `clean-slate-image-restructure.ts` for full reset.

---

## 🎯 Common Workflows

### Initial Setup
```bash
# 1. Create admin user
npx tsx scripts/create-first-admin.ts

# 2. Setup default settings
npx tsx scripts/seed-default-settings.ts

# 3. Populate editorials
npx tsx scripts/create-editorials.ts

# 4. Upload project images
npx tsx scripts/upload-project-images.ts
```

### Adding New Projects
```bash
# 1. Create project in admin interface
# 2. Organize images in Desktop/project-folder/Project - {Name}/
# 3. Run upload script
npx tsx scripts/upload-project-images.ts
```

### Verification & Health Check
```bash
# Check database
npx tsx scripts/check-projects.ts

# Check storage
npx tsx scripts/check-projects-folder.ts

# Test draft/live functionality
./scripts/test-status.sh
```

### Cleanup Orphaned Files
```bash
# Remove unused files from storage
npx tsx scripts/cleanup-by-timestamp.ts
```

### Full Reset (Emergency)
```bash
# 1. Clear everything
npx tsx scripts/clean-slate-image-restructure.ts

# 2. Re-upload all images
npx tsx scripts/upload-project-images.ts
```

---

## 🔐 Environment Variables Required

All scripts require `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_DB_URL=...
```

---

## 📝 Best Practices

### Swedish Characters in URLs
- Å → aa
- Ä → ae
- Ö → oe

Examples:
- "Östermalm" → `oestermalm`
- "Malmö" → `malmoe`
- "Västerås" → `vaesteraas`

### Image Storage Structure
```
/images/
  /projects/
    /project-slug/
      project-slug-timestamp-random.jpg
      project-slug-timestamp-random.png
      ...
```

### Image Naming
- Format: `{project-slug}-{timestamp}-{random6}.{ext}`
- Example: `wallin-revival-1760389477-abc123.jpg`
- No UUIDs in filenames
- Clean, sequential, traceable

### Database Tags
- `before` - Before renovation images
- `after` - After renovation images  
- `gallery` - Gallery display images (usually same as after)
- `hero` - Hero/featured image (auto-set)

---

## ⚠️ Important Notes

1. **Always backup before running destructive scripts**
2. **Verify with check scripts before cleanup**
3. **Storage and database are separate** - some scripts only affect one
4. **Images are auto-published** when uploaded via `upload-project-images.ts`
5. **Maximum 8 pairs per project** - enforced in upload script
6. **Supported image formats:** jpg, jpeg, png, webp, gif

---

## 🆘 Troubleshooting

### "Project not found in database"
- Create project in admin interface first
- Check project slug matches folder name (with proper transliteration)

### "Too many files in storage"
- Run `cleanup-by-timestamp.ts` to remove orphaned files

### "Images not showing on frontend"
- Check `isPublished` status with `check-projects.ts`
- Verify storage URLs with `check-projects-folder.ts`
- Run `cleanup-by-timestamp.ts` if there are orphaned files

### "Duplicate images"
- Run `cleanup-by-timestamp.ts` to remove duplicates
- Database URLs are the source of truth

---

## 📊 Storage Limits

**Supabase Free Tier:**
- 1GB total storage
- ~338 images currently (all projects)
- ~50-60 images per project average
- Monitor with `check-projects-folder.ts`

---

*Last updated: October 2025*
*Total scripts: 11 (down from 50+)*

