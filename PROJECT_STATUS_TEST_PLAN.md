# Project Status Testing Plan (Draft/Live Mode)

## Overview
This document provides a comprehensive test plan for the project status functionality that allows switching projects between **Draft** and **Live** modes.

## System Architecture

### Database Schema
- **Table**: `projects`
- **Field**: `isPublished` (boolean, default: true)
- **Field**: `publishedAt` (timestamp, set when published, null when draft)

### Key Components
1. **Admin Interface**: `/admin/projects` - Shows all projects with toggle controls
2. **Public Interface**: `/projects` - Shows only published projects
3. **API Endpoint**: `PUT /api/projects/{id}` - Updates project status
4. **Toggle Component**: `InlineToggle` - UI component for status control

### Status Flow
```
Draft (isPublished: false) ←→ Live (isPublished: true)
     publishedAt: null            publishedAt: timestamp
```

---

## Pre-Test Setup

### 1. Start Development Server
```bash
npm run dev
```
Server should be running at: http://localhost:3000

### 2. Login as Admin
- Navigate to: http://localhost:3000/login
- Login with admin credentials
- Verify you have admin access

### 3. Check Current Projects
- Navigate to: http://localhost:3000/admin/projects
- Note the current projects and their statuses
- Open browser DevTools console to monitor logs

---

## Test Cases

### Test 1: View All Projects in Admin
**Objective**: Verify admin can see all projects regardless of status

**Steps**:
1. Navigate to `/admin/projects`
2. Observe the projects list

**Expected Results**:
- ✅ All projects are visible (both draft and live)
- ✅ Each project shows a toggle switch
- ✅ Toggle state matches project status:
  - Green toggle + "Live" label = Published
  - Gray toggle + "Draft" label = Unpublished
- ✅ Console logs show: `📊 Admin Projects - Fetching projects`

**Screenshot Areas**: Project list with toggle states

---

### Test 2: Change Project from Live to Draft
**Objective**: Verify live projects can be unpublished

**Steps**:
1. Find a project with "Live" status (green toggle)
2. Click the toggle switch
3. Observe the UI change
4. Check browser console logs
5. Navigate to `/projects` (public page)
6. Return to `/admin/projects`

**Expected Results**:
- ✅ Toggle animates to gray position
- ✅ Label changes from "Live" to "Draft"
- ✅ Console logs show:
  ```
  🔄 Toggle clicked for {id}: true → false
  📥 PUT Request for project: {id}
  📊 Received data: { ...isPublished: false }
  ✅ Updated project in DB: { ...isPublished: false, publishedAt: null }
  ✅ Successfully updated project {id} publish status to false
  ```
- ✅ Project does NOT appear on public `/projects` page
- ✅ Project still visible in admin with "Draft" status
- ✅ Status persists after page refresh

**Data Verification**:
- Database: `isPublished = false`
- Database: `publishedAt = null`
- Database: `updatedAt` is updated

---

### Test 3: Change Project from Draft to Live
**Objective**: Verify draft projects can be published

**Steps**:
1. Find a project with "Draft" status (gray toggle)
2. Click the toggle switch
3. Observe the UI change
4. Check browser console logs
5. Navigate to `/projects` (public page)
6. Return to `/admin/projects`

**Expected Results**:
- ✅ Toggle animates to green position
- ✅ Label changes from "Draft" to "Live"
- ✅ Console logs show:
  ```
  🔄 Toggle clicked for {id}: false → true
  📥 PUT Request for project: {id}
  📊 Received data: { ...isPublished: true }
  ✅ Updated project in DB: { ...isPublished: true, publishedAt: [timestamp] }
  ✅ Successfully updated project {id} publish status to true
  ```
- ✅ Project APPEARS on public `/projects` page
- ✅ Project visible in admin with "Live" status
- ✅ Status persists after page refresh

**Data Verification**:
- Database: `isPublished = true`
- Database: `publishedAt` has current timestamp
- Database: `updatedAt` is updated

---

### Test 4: Public Page Filtering
**Objective**: Verify public page only shows published projects

**Steps**:
1. From `/admin/projects`, note which projects are Live vs Draft
2. Navigate to `/projects` (public page)
3. Compare visible projects

**Expected Results**:
- ✅ Only "Live" projects appear on public page
- ✅ No "Draft" projects are visible
- ✅ Console logs show:
  ```
  📊 Database returned projects: {total_count}
  Project {title}: isPublished={true/false}
  📊 After filtering: {published_count} published projects
  ```
- ✅ Empty state message appears if no published projects

---

### Test 5: Multiple Toggle Operations
**Objective**: Test rapid status changes

**Steps**:
1. Toggle a project from Live → Draft
2. Wait 2 seconds
3. Toggle the same project from Draft → Live
4. Wait 2 seconds
5. Toggle back to Draft

**Expected Results**:
- ✅ Each toggle operation completes successfully
- ✅ No race conditions or stuck states
- ✅ Final status matches last toggle action
- ✅ All database updates complete successfully
- ✅ Public page updates correctly after each change

---

### Test 6: Status Persistence
**Objective**: Verify status persists across sessions

**Steps**:
1. Set a project to Draft status
2. Set another project to Live status
3. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+F5)
4. Close and reopen the browser
5. Navigate back to `/admin/projects`

**Expected Results**:
- ✅ Draft project remains in Draft state
- ✅ Live project remains in Live state
- ✅ No status changes after page refresh
- ✅ No status changes after browser restart

---

### Test 7: Project Data Integrity
**Objective**: Ensure toggling status doesn't affect other project data

**Steps**:
1. Note a project's details (title, images, content)
2. Toggle its status
3. Click into the project detail page
4. Verify all data is intact

**Expected Results**:
- ✅ Title unchanged
- ✅ Hero image unchanged
- ✅ Project images intact (same count and order)
- ✅ Image pairs intact
- ✅ Content/summary unchanged
- ✅ Facts unchanged
- ✅ Console shows:
  ```
  🔍 Project data for toggle: {
    projectImagesCount: {count},
    imagePairsCount: {count}
  }
  📤 Sending to API: { projectImages: [...], imagePairs: [...] }
  ```

---

### Test 8: Error Handling
**Objective**: Test system behavior during failures

**Steps**:
1. Open browser DevTools → Network tab
2. Enable "Offline" mode
3. Try to toggle a project status
4. Observe error handling
5. Disable "Offline" mode
6. Refresh and verify project status

**Expected Results**:
- ✅ Toggle shows loading state (disabled)
- ✅ Error alert appears: "Failed to update status"
- ✅ Toggle reverts to previous state
- ✅ Console logs show error
- ✅ After coming back online, original status is preserved
- ✅ No data corruption

---

### Test 9: Direct URL Access (Draft Projects)
**Objective**: Verify draft projects are accessible via direct URL

**Steps**:
1. Set a project to Draft status
2. Note its slug
3. Navigate to `/projects/{slug}` directly
4. Check if page is accessible

**Expected Results**:
- ✅ Draft project detail page is accessible (no 404)
- ✅ All project data displays correctly
- ✅ Project just doesn't appear in the listing page

**Note**: This is the current behavior. Update this test if draft projects should be completely hidden.

---

### Test 10: Content Status API
**Objective**: Verify the content status API reflects changes

**Steps**:
1. Toggle a project from Live to Draft
2. Call: `curl http://localhost:3000/api/content/status | jq '.projects'`
3. Toggle it back to Live
4. Call the API again

**Expected Results**:
- ✅ API returns correct status for all projects
- ✅ Draft project shows: `"slug": false`
- ✅ Live project shows: `"slug": true`
- ✅ Status updates immediately after toggle

---

### Test 11: UI/UX Validation
**Objective**: Verify user interface quality

**Checklist**:
- ✅ Toggle animation is smooth (200ms transition)
- ✅ Toggle has clear visual states (green=live, gray=draft)
- ✅ Labels are clear and accurate
- ✅ Loading state is visible during API call
- ✅ Clicking toggle doesn't navigate to project page
- ✅ Toggle is keyboard accessible
- ✅ Proper hover states on toggle
- ✅ Status label has proper contrast

---

## Console Log Checklist

When testing, verify these console logs appear:

### Admin Projects Page Load
```
📊 Admin Projects - Fetching projects
📊 Admin Projects - Response: { status: 200, ok: true }
📊 Admin Projects - Data: { count: X, data: [...] }
```

### Toggle to Draft
```
Toggling project {id} to draft
🔍 Project data for toggle: { ... }
📥 PUT Request for project: {id}
📊 Received data: { isPublished: false, ... }
✅ Updated project in DB: { isPublished: false, publishedAt: null }
✅ Refreshed all projects from database
✅ Successfully updated project {id} publish status to false
```

### Toggle to Live
```
Toggling project {id} to published
🔍 Project data for toggle: { ... }
📥 PUT Request for project: {id}
📊 Received data: { isPublished: true, ... }
✅ Updated project in DB: { isPublished: true, publishedAt: [timestamp] }
✅ Refreshed all projects from database
✅ Successfully updated project {id} publish status to true
```

### Public Page Load
```
📊 Database returned projects: {count}
Project {title}: isPublished=true, data={...}
Project {title}: isPublished=false, data={...}
📊 After filtering: {count} published projects
```

---

## Database Verification Queries

Use these SQL queries to verify database state:

### Check All Project Statuses
```sql
SELECT id, title, slug, "isPublished", "publishedAt", "updatedAt" 
FROM projects 
ORDER BY "updatedAt" DESC;
```

### Count Published vs Draft
```sql
SELECT 
  COUNT(*) FILTER (WHERE "isPublished" = true) as published_count,
  COUNT(*) FILTER (WHERE "isPublished" = false) as draft_count,
  COUNT(*) as total_count
FROM projects;
```

### Recent Status Changes
```sql
SELECT id, title, "isPublished", "publishedAt", "updatedAt"
FROM projects
WHERE "updatedAt" > NOW() - INTERVAL '10 minutes'
ORDER BY "updatedAt" DESC;
```

---

## Known Issues & Limitations

### Current Behavior
1. ✅ Draft projects are still accessible via direct URL
2. ✅ Draft projects only hidden from listing pages
3. ✅ All images and data preserved during status changes
4. ✅ PublishedAt timestamp updates each time published (not first publish only)

### Edge Cases Handled
- ✅ Rapid toggling doesn't cause race conditions
- ✅ Page refresh during toggle completes correctly
- ✅ Network errors revert to previous state
- ✅ Project images/pairs preserved during toggle

---

## Success Criteria

All tests pass when:
- ✅ Projects can be toggled between Draft and Live
- ✅ Draft projects don't appear on public pages
- ✅ Live projects appear on public pages
- ✅ Status persists after refresh
- ✅ No data loss during status changes
- ✅ Error handling works correctly
- ✅ UI provides clear feedback
- ✅ Console logs confirm operations
- ✅ Database state is correct

---

## Test Execution Checklist

- [ ] Test 1: View All Projects in Admin
- [ ] Test 2: Change Project from Live to Draft
- [ ] Test 3: Change Project from Draft to Live
- [ ] Test 4: Public Page Filtering
- [ ] Test 5: Multiple Toggle Operations
- [ ] Test 6: Status Persistence
- [ ] Test 7: Project Data Integrity
- [ ] Test 8: Error Handling
- [ ] Test 9: Direct URL Access (Draft Projects)
- [ ] Test 10: Content Status API
- [ ] Test 11: UI/UX Validation
- [ ] Console Logs Verified
- [ ] Database State Verified

---

## Reporting Issues

When reporting issues, include:
1. Test case number and description
2. Steps to reproduce
3. Expected vs actual behavior
4. Console logs (with timestamps)
5. Network tab screenshots (if API related)
6. Database query results
7. Browser and version

---

## Quick Test Commands

```bash
# Start server
npm run dev

# Check projects API
curl http://localhost:3000/api/projects | jq '.[].isPublished'

# Check content status API
curl http://localhost:3000/api/content/status | jq '.projects'

# Monitor server logs
tail -f .next/server-logs.txt  # if logging to file
```

---

## Test Results Template

```
Date: ___________
Tester: ___________
Environment: Development / Production
Browser: ___________

Test 1: [ PASS / FAIL ] - Notes: ___________
Test 2: [ PASS / FAIL ] - Notes: ___________
Test 3: [ PASS / FAIL ] - Notes: ___________
Test 4: [ PASS / FAIL ] - Notes: ___________
Test 5: [ PASS / FAIL ] - Notes: ___________
Test 6: [ PASS / FAIL ] - Notes: ___________
Test 7: [ PASS / FAIL ] - Notes: ___________
Test 8: [ PASS / FAIL ] - Notes: ___________
Test 9: [ PASS / FAIL ] - Notes: ___________
Test 10: [ PASS / FAIL ] - Notes: ___________
Test 11: [ PASS / FAIL ] - Notes: ___________

Overall Status: [ PASS / FAIL ]
Critical Issues: ___________
Recommendations: ___________
```

---

**Last Updated**: October 14, 2025
**Version**: 1.0

