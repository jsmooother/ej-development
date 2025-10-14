# 🎯 Project Status Testing - Cheatsheet

**PRINT THIS PAGE** and keep it beside you while testing!

---

## 🔗 URLs (Server on port 3001)

```
Admin:  http://localhost:3001/admin/projects
Public: http://localhost:3001/projects
API:    http://localhost:3001/api/projects
```

---

## 📊 Current State

| Project | Status | Should Show on Public? |
|---------|--------|------------------------|
| No1 Östermalm | 🟢 LIVE | ✅ YES |
| Wallin Revival | 🟢 LIVE | ✅ YES |
| **The Nest** | ⚫ DRAFT | ❌ NO |
| Grand Celeste | 🟢 LIVE | ✅ YES |
| Classic Pearl | 🟢 LIVE | ✅ YES |

**Total**: 5 projects (4 live, 1 draft)

---

## 🧪 5-Minute Test

### 1️⃣ Verify Initial State
- [ ] Admin shows all 5 projects
- [ ] Public shows 4 projects (no "The Nest")
- [ ] 4 green toggles, 1 gray toggle

### 2️⃣ Toggle Live → Draft
- [ ] Click "No1 Östermalm" toggle
- [ ] Turns GRAY, says "Draft"
- [ ] Public page refresh → only 3 projects

### 3️⃣ Toggle Draft → Live
- [ ] Click "The Nest" toggle
- [ ] Turns GREEN, says "Live"
- [ ] Public page refresh → 4 projects (The Nest appears)

### 4️⃣ Restore & Persist
- [ ] Toggle both back to original
- [ ] Hard refresh admin page (Cmd+Shift+R)
- [ ] Status unchanged

### 5️⃣ Check Console
- [ ] ✅ Success messages (green)
- [ ] ❌ No errors (red)

---

## ✅ What to Look For

### Visual (Admin Page)
```
🟢 GREEN toggle = LIVE    = Shows on public
⚫ GRAY toggle  = DRAFT   = Hidden from public
```

### Animation
- Smooth 200ms transition
- Toggle slides left/right
- Color changes
- Label updates

### Console (To Draft)
```
✓ "Toggling project ... to draft"
✓ "isPublished: false"
✓ "publishedAt: null"
✓ "Successfully updated"
```

### Console (To Live)
```
✓ "Toggling project ... to published"
✓ "isPublished: true"
✓ "publishedAt: 2025-..."
✓ "Successfully updated"
```

---

## 🐛 Common Issues

| Problem | Check | Solution |
|---------|-------|----------|
| Toggle doesn't work | Console errors? | Hard refresh (Cmd+Shift+R) |
| Public shows draft | Did you refresh? | Clear cache & refresh |
| Status doesn't persist | Network errors? | Check database connection |

---

## 📸 Screenshots Needed

1. ✅ Admin - Initial (5 projects)
2. ✅ Public - Initial (4 projects)
3. ✅ Admin - After toggle to draft
4. ✅ Public - After toggle (3 projects)
5. ✅ Admin - After toggle to live
6. ✅ Public - After toggle (4 projects)

---

## ⌨️ Quick Commands

```bash
# Check database
npx tsx scripts/check-projects.ts

# Run automated test
./scripts/test-status.sh

# Open pages
open http://localhost:3001/admin/projects
open http://localhost:3001/projects
```

---

## 📋 Final Checklist

- [ ] All toggles work
- [ ] Public page filters correctly
- [ ] Status persists after refresh
- [ ] Console shows success messages
- [ ] No errors encountered
- [ ] Screenshots taken
- [ ] PASS ✅ / FAIL ❌

---

## 🎓 Remember

**DevTools**: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Win)  
**Hard Refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Win)  
**Refresh**: `Cmd+R` (Mac) or `Ctrl+R` (Win)

---

## 📚 Full Docs

For detailed testing:
- `BROWSER_TEST_READY.md` - Start here
- `QUICK_TEST_REFERENCE.md` - Full reference
- `BROWSER_TEST_EXECUTION.md` - 12 test cases
- `PROJECT_STATUS_TESTING_INDEX.md` - Complete index

---

**Time**: 5-10 minutes | **Result**: _______

---

_Last updated: Oct 14, 2025_

