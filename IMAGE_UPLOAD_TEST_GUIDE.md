# Image Upload Testing Guide

## Testing Steps

### 1. Test Hero Image Upload
1. Go to `/admin/projects/new`
2. Fill in basic information (title, slug)
3. **Upload a hero image** using one of these methods:
   - Click the upload area and select a file
   - Paste an image URL in the URL input field
   - Use the "Quick select images" preset gallery
4. Check the **browser console** for: `✅ File uploaded successfully`
5. Check the **server terminal** for upload confirmation

### 2. Test Multi-File Upload
1. Scroll down to "Project Images" section
2. **Upload multiple images** using one of these methods:
   - Click to select multiple files
   - **Drag and drop** multiple files onto the upload area
3. Watch for:
   - Upload progress indicator
   - Image thumbnails appearing
   - Console logs showing uploads

### 3. Test Project Creation
1. Fill in remaining fields (summary, facts, etc.)
2. Click "Create Project"
3. Check **server terminal** for these logs:
   ```
   📊 Creating project with data: {
     title: "Your Project Name",
     projectImagesCount: 5,  // Should match uploaded count
     imagePairsCount: 0,
     hasProjectImages: true,
     hasImagePairs: true
   }
   ```
4. Then look for:
   ```
   ✅ Project created successfully: {
     id: "...",
     title: "Your Project Name",
     projectImagesStored: 5,  // Should match uploaded count
     imagePairsStored: 0
   }
   ```

### 4. Verify Data Persistence
1. After creation, you'll be redirected to `/admin/projects`
2. Click on your newly created project to **edit** it
3. Check **server terminal** for:
   ```
   📊 Fetched project: {
     id: "...",
     title: "Your Project Name",
     projectImagesCount: 5,  // Should match what you uploaded
     imagePairsCount: 0,
     hasProjectImagesData: true
   }
   ```
4. **Verify in the UI** that:
   - Hero image displays correctly
   - All uploaded project images appear in the gallery
   - Image count matches what you uploaded

## Expected Server Logs Sequence

When uploading 3 images to a new project, you should see:

```bash
# During upload
✅ File uploaded successfully: { filename: 'image1.jpg', path: 'uploads/...', size: '245.67KB', url: 'https://...' }
✅ File uploaded successfully: { filename: 'image2.jpg', path: 'uploads/...', size: '312.45KB', url: 'https://...' }
✅ File uploaded successfully: { filename: 'image3.jpg', path: 'uploads/...', size: '198.23KB', url: 'https://...' }

# During project creation
📊 Creating project with data: {
  title: 'Test Project',
  projectImagesCount: 3,
  imagePairsCount: 0,
  hasProjectImages: true,
  hasImagePairs: true
}

✅ Project created successfully: {
  id: 'abc-123-...',
  title: 'Test Project',
  projectImagesStored: 3,
  imagePairsStored: 0
}

# When reopening the project
📊 Fetched project: {
  id: 'abc-123-...',
  title: 'Test Project',
  projectImagesCount: 3,
  imagePairsCount: 0,
  hasProjectImagesData: true
}
```

## What to Check For

### ✅ Success Indicators:
- Upload API logs show files being uploaded to Supabase
- `projectImagesCount` matches number of uploaded images
- `projectImagesStored` confirms data was saved to database
- When fetching project, `projectImagesCount` matches original upload
- Images display correctly in the edit page

### ❌ Failure Indicators:
- `projectImagesCount: 0` when you uploaded images
- `hasProjectImages: false` 
- No images appear when editing the project
- Mismatch between uploaded count and stored count

## Common Issues

### Issue: Images upload but count is 0
**Cause**: Data not being passed from component to form submission
**Check**: Console logs in browser for `projectImages` state

### Issue: Images don't persist after save
**Cause**: Database column might not accept JSONB or data format mismatch
**Check**: Server error logs for database errors

### Issue: Can't see images when editing
**Cause**: Array safety checks or data format issues
**Check**: Browser console for React errors

## Test Checklist

- [ ] Hero image upload works (click to upload)
- [ ] Hero image URL paste works
- [ ] Multi-file upload works (click to select)
- [ ] Drag-and-drop works (Chrome & other browsers)
- [ ] Upload progress shows correctly
- [ ] Image thumbnails display after upload
- [ ] Remove image button works
- [ ] Project saves with correct image count
- [ ] Images persist after save (check terminal logs)
- [ ] Images display when editing project
- [ ] Image count matches between create and edit

---

**After completing these tests**, check your terminal and report:
1. Did all upload logs appear? ✅/❌
2. Did projectImagesCount match your uploads? ✅/❌  
3. Did images persist when reopening the project? ✅/❌
4. Did images display correctly in the edit page? ✅/❌
