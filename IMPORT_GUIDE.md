# Project Import Guide

## Quick One-Time Import

To populate your site with 5 sample projects, simply run:

```bash
npm run import-sample
```

This will import 5 pre-configured projects with:
- ✅ Complete project data (title, description, facts)
- ✅ Hero images
- ✅ Before/after image pairs
- ✅ Gallery images
- ✅ Proper tagging and organization

## What Gets Imported

### 1. Modern Villa Renovation
- 280 sqm, 4 bedrooms, 3 bathrooms
- Complete transformation story
- Before/after kitchen transformation

### 2. Luxury Apartment Redesign
- 120 sqm, 2 bedrooms, 2 bathrooms
- High-end finishes and smart home tech
- City views and premium materials

### 3. Family Home Extension
- 200 sqm, 3 bedrooms, 2 bathrooms
- Thoughtful extension with sustainable features
- Family-friendly design

### 4. Historic Townhouse Restoration
- 180 sqm, 3 bedrooms, 2 bathrooms
- 19th-century restoration
- Original features preserved

### 5. Contemporary Loft Conversion
- 150 sqm, 1 bedroom, 1 bathroom
- Industrial to modern conversion
- Exposed brick and timber beams

## After Import

1. **Check the admin panel** at `/admin/projects` to see your imported projects
2. **View the frontend** at `/projects` to see how they display
3. **Edit projects** to customize with your own content and images
4. **Upload your own images** to replace the sample ones

## Customizing the Import

To modify the sample data before importing:

1. Edit `scripts/one-time-import.ts`
2. Update the `sampleProjects` array with your own data
3. Run `npm run import-sample`

## Image URLs

The sample projects use Unsplash images. To use your own images:

1. Upload your images to your storage (Supabase, etc.)
2. Update the `heroImagePath` and `projectImages` URLs in the script
3. Run the import

## Next Steps

After importing:
- ✅ Set up your hero project in admin settings
- ✅ Customize project content and images
- ✅ Add more projects through the admin interface
- ✅ Configure site settings and content limits
