# Quick Test Reference Card - Draft/Live Toggle

**Server**: http://localhost:3001  
**Test Duration**: ~10 minutes

---

## 🎯 Quick Test Flow

### 1. Open Both Pages
```bash
# Admin page (shows all projects)
open http://localhost:3001/admin/projects

# Public page (shows only live projects)
open http://localhost:3001/projects
```

### 2. Open DevTools
- **Chrome/Edge**: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)
- **Firefox**: `Cmd+Option+K` (Mac) or `Ctrl+Shift+K` (Windows)
- **Safari**: `Cmd+Option+C` (Mac)

### 3. Initial Check
**Admin Page** → Should see 5 projects:
- ✅ 4 with GREEN toggle (Live)
- ✅ 1 with GRAY toggle (Draft - "The Nest")

**Public Page** → Should see 4 projects:
- ✅ Only the live ones
- ✅ "The Nest" is hidden

---

## 🧪 Simple 5-Step Test

### Step 1: Pick a Live Project
- Find "No1 Östermalm" (green toggle)
- Click the toggle
- **Expect**: Turns GRAY, label says "Draft"

### Step 2: Check Public Page
- Switch to public tab
- Refresh (Cmd+R)
- **Expect**: "No1 Östermalm" is GONE (only 3 projects)

### Step 3: Pick a Draft Project
- Switch back to admin tab
- Find "The Nest" (gray toggle)
- Click the toggle
- **Expect**: Turns GREEN, label says "Live"

### Step 4: Check Public Page Again
- Switch to public tab
- Refresh (Cmd+R)
- **Expect**: "The Nest" APPEARS (4 projects again)

### Step 5: Restore Original
- Toggle both projects back
- Refresh admin page
- **Expect**: Status unchanged (4 Live, 1 Draft)

---

## 📋 Console Log Checklist

### When Toggling to DRAFT:
```
✓ "Toggling project {id} to draft"
✓ "isPublished: false"
✓ "publishedAt: null"
✓ "Successfully updated project"
```

### When Toggling to LIVE:
```
✓ "Toggling project {id} to published"
✓ "isPublished: true"
✓ "publishedAt: [timestamp]"
✓ "Successfully updated project"
```

### On Public Page:
```
✓ "📊 After filtering: X published projects"
```

---

## ✅ Pass/Fail Checklist

Quick checklist while testing:

- [ ] Toggle animates smoothly (green ↔ gray)
- [ ] Label changes (Live ↔ Draft)
- [ ] Public page hides draft projects
- [ ] Public page shows live projects
- [ ] Status persists after page refresh
- [ ] Console shows success messages
- [ ] No errors in console (red text)
- [ ] No navigation when clicking toggle
- [ ] Data intact after toggle (check one project)

**If all checked**: ✅ TEST PASSED  
**If any unchecked**: ❌ See BROWSER_TEST_EXECUTION.md for detailed debugging

---

## 🐛 Common Issues & Fixes

### Toggle doesn't change
- **Check**: Console for errors
- **Try**: Hard refresh (Cmd+Shift+R)
- **Verify**: Server is running on port 3001

### Public page shows draft
- **Check**: Actually refreshed the page?
- **Try**: Clear browser cache
- **Verify**: Console says "After filtering: X published"

### Toggle changes but reverts
- **Check**: Network tab for failed requests
- **Try**: Check database connection
- **Verify**: No "Failed to fetch" errors

---

## 🔍 Quick Database Check

```bash
# See current status of all projects
npx tsx scripts/check-projects.ts

# Run automated test
./scripts/test-status.sh
```

---

## 📸 Screenshot Checklist

Take these 4 key screenshots:

1. **Admin - Before** (5 projects, 4 live, 1 draft)
2. **Public - Before** (4 projects visible)
3. **Admin - After Toggle** (showing status change)
4. **Public - After Toggle** (showing visibility change)

---

## ⏱️ Expected Timings

- Toggle response: < 500ms
- Page refresh: < 1s
- API call: < 200ms
- Animation: 200ms

---

## 🎬 Video Recording (Optional)

If you want to record:
1. Start screen recording
2. Show admin page with all projects
3. Click toggle (Live → Draft)
4. Switch to public tab, refresh
5. Show project is hidden
6. Switch back, toggle (Draft → Live)
7. Switch to public tab, refresh
8. Show project appears
9. Stop recording

**Tools**:
- Mac: QuickTime Player or Cmd+Shift+5
- Windows: Xbox Game Bar (Win+G)
- Chrome Extension: Loom

---

## 🚨 Emergency Commands

If something goes wrong:

```bash
# Restart server
# Stop: Ctrl+C
# Start: npm run dev

# Check database state
npx tsx scripts/check-projects.ts

# Run automated test to verify
./scripts/test-status.sh

# Check for linter errors
npm run lint
```

---

## ✨ Success Looks Like

**Admin Page**:
- All 5 projects visible
- Clear status indicators (green/gray toggles)
- Smooth animations
- Accurate labels (Live/Draft)

**Public Page**:
- Only live projects visible
- No draft projects
- Correct project count

**Console**:
- Success messages (green ✅)
- No errors (red ❌)
- Proper logging

**Persistence**:
- Status same after refresh
- Status same after browser restart

---

## 📊 Current Expected State

Based on automated tests:

### Projects:
1. **No1 Östermalm** - 🟢 LIVE
2. **Wallin Revival** - 🟢 LIVE  
3. **The Nest** - ⚫ DRAFT
4. **Grand Celeste** - 🟢 LIVE
5. **Classic Pearl** - 🟢 LIVE

### Visible on Public:
- No1 Östermalm ✓
- Wallin Revival ✓
- Grand Celeste ✓
- Classic Pearl ✓
- ~~The Nest~~ (hidden)

---

## 📝 Quick Notes Template

```
Test Started: [Time]

✅ Initial state correct
✅ Toggle Live → Draft works
✅ Public hides draft
✅ Toggle Draft → Live works  
✅ Public shows live
✅ Status persists

Issues: [None / List issues]

Test Completed: [Time]
Result: PASS / FAIL
```

---

**Print this page for quick reference while testing!**

*Last Updated: October 14, 2025*

