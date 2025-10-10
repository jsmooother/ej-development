# 🗄️ Supabase Storage Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Name it: `project-images`
6. Make it **Public** ✅
7. Click **"Create bucket"**

### Step 2: Configure Bucket Policies

The bucket needs to be publicly readable but only writable by authenticated users (or service role).

**Option A: Make Fully Public (Easiest for Development)**

1. Go to **Storage** → `project-images` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Choose **"For full customization"**
5. Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );
```

**Option B: Allow Anonymous Uploads (For Import Script)**

If you want the import script to work without authentication:

```sql
-- Allow public uploads
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );
```

### Step 3: Update CORS (If Needed)

In **Storage Settings**:
```json
{
  "allowedOrigins": ["*"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

### Step 4: Verify Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for server-side uploads)
```

### Step 5: Test Upload

1. Go to `/admin/projects/new`
2. Try uploading an image in the Hero Image section
3. Should see upload progress and success!

---

## Folder Structure in Supabase

Once set up, your storage will look like:

```
Bucket: project-images/
├── projects/                    ← Admin UI uploads
│   ├── 1728567890-hero.jpg
│   ├── 1728567891-image.jpg
│   └── ...
│
├── villa-serenidad/             ← Bulk imports
│   ├── hero.jpg
│   ├── before-1.jpg
│   ├── after-1.jpg
│   └── gallery-1.jpg
│
└── finca-moderna/
    └── ...
```

---

## Using the Bulk Import

### 1. Prepare Your Images

```bash
mkdir -p project-images/villa-serenidad
# Copy your images into the folder
```

### 2. (Optional) Add project.json

Create `project-images/villa-serenidad/project.json`:

```json
{
  "title": "Villa Serenidad",
  "slug": "villa-serenidad",
  "summary": "La Zagaleta · 2024 - Luxury villa transformation",
  "content": "This magnificent property represents...",
  "year": 2024,
  "facts": {
    "sqm": 485,
    "plot": 2400,
    "bedrooms": 5,
    "bathrooms": 4
  },
  "isPublished": true,
  "isHero": false
}
```

### 3. Run Import Script

```bash
npm run import-projects
```

### 4. Check Admin Panel

Go to `/admin/projects` and verify all projects are created with images!

---

## Public URLs

All uploaded images get public URLs like:

```
https://your-project.supabase.co/storage/v1/object/public/project-images/villa-serenidad/hero.jpg
```

These URLs:
- ✅ Are permanent
- ✅ Are globally accessible
- ✅ Support Next.js Image optimization
- ✅ Have CDN caching
- ✅ Work in production (Vercel)

---

## Tips

1. **Organize by project** - Keep each project in its own folder
2. **Name files clearly** - Use `hero`, `before-1`, `after-1`, `gallery-1`, etc.
3. **Optimize before upload** - Compress large images to under 2MB for faster loading
4. **Use project.json** - Makes updates easier, keeps metadata with images
5. **Version control** - Don't commit `project-images` folder (add to `.gitignore`)

---

## Troubleshooting

**"Upload failed: new row violates bucket policy"**
→ Bucket policies not set correctly. Make bucket public or add upload policy.

**"Missing Supabase configuration"**
→ Check your `.env.local` has the required Supabase variables.

**Images upload but don't display**
→ Check Next.js image config allows `**.supabase.co` domain.

**Import script can't find folders**
→ Create `project-images` directory in project root.

---

Ready to upload! 🚀

