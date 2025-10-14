# Scripts Cleanup Plan

## ✅ KEEP - Useful Production Scripts

### User Management
- `create-first-admin.ts` - Create admin users
- `create-editor-user.ts` - Create editor users

### Data Population
- `create-editorials.ts` - Populate editorial content
- `seed-default-settings.ts` - Setup default site settings
- `upload-project-images.ts` - **MAIN SCRIPT** for uploading project images

### Database Utilities
- `check-projects.ts` - Verify project data
- `check-projects-folder.ts` - Verify storage structure

### Emergency/Maintenance
- `clean-slate-image-restructure.ts` - Full reset for images
- `cleanup-by-timestamp.ts` - Smart cleanup of unused files
- `simple-reset.ts` - Reset database data
- `cleanup-storage.ts` - Clear storage bucket

---

## 🗑️ DELETE - Obsolete/Duplicate Scripts

### Obsolete Import Scripts (Replaced by upload-project-images.ts)
- `add-project.ts` - One-off, no longer needed
- `import-from-folders.ts` - Old version
- `import-projects-from-folders.ts` - Old version
- `import-real-projects.ts` - Old version
- `import-your-projects.ts` - Old version
- `import-local-images.ts` - Superseded
- `one-time-import.ts` - One-time use
- `update-projects-with-images.ts` - One-time use
- `update-editorial-images.ts` - One-time use
- `proper-image-upload-helper.ts` - Demo only

### Obsolete Migration Scripts (Already Applied)
- `add-hero-column.sql` - Applied
- `add-missing-columns.sql` - Applied
- `add-missing-columns 2.sql` - Duplicate
- `add-project-image-columns.sql` - Applied
- `apply-migrations.ts` - Applied
- `apply-migrations 2.ts` - Duplicate

### Obsolete Cleanup Scripts (Job Done)
- `cleanup-and-reset.ts` - Superseded by simple-reset
- `cleanup-duplicates.ts` - Job done
- `cleanup-duplicate-images.ts` - Job done
- `consolidate-images-to-single-folder.ts` - Abandoned approach
- `move-images-to-consolidated-folder.ts` - Abandoned approach
- `rebuild-image-links.ts` - Old version
- `rebuild-image-links-v2.ts` - Job done
- `fix-ostermalm-slug.ts` - One-time fix

### Obsolete Check Scripts (Replaced)
- `check-deep-storage.ts` - Job done
- `check-project-folders.ts` - Replaced by check-projects-folder.ts
- `check-project-images.ts` - Job done
- `check-storage-duplicates.ts` - Job done
- `check-storage-images.ts` - Job done
- `list-storage-files.ts` - Job done

### Obsolete Seed Scripts (Duplicates)
- `seed-mock-data.ts` - Old version
- `seed-mock-data 2.ts` - Duplicate
- `seed-simple.ts` - Old version
- `seed-simple 2.ts` - Duplicate
- `seed.ts` - Superseded

### Obsolete Conversion Scripts
- `convert-heic-simple.ts` - Not used
- `convert-heic-to-jpeg.ts` - Job done, images converted

### Obsolete Reset Scripts (Duplicates)
- `reset-database.ts` - Superseded by simple-reset

### Obsolete Setup Scripts
- `setup-storage.ts` - Already setup

---

## 📋 Summary

**Keep:** 10 scripts
**Delete:** 40+ scripts

Total cleanup: ~75% reduction in script clutter!

