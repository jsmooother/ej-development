# Browser Test Execution - Draft/Live Project Status

**Date**: October 14, 2025  
**Test URL**: http://localhost:3001  
**Browser**: Chrome/Safari/Firefox  
**Tester**: Manual Execution Required

---

## 🎯 Test Objective

Verify the draft/live toggle functionality works correctly in the browser UI, including:
- Visual feedback of status changes
- Public page filtering
- Data persistence
- Console logging

---

## 📋 Pre-Test Setup

### ✅ Confirmed Setup
- [x] Development server running on port 3001
- [x] Database has 5 projects total
  - 4 Live projects
  - 1 Draft project ("The Nest")
- [x] Automated tests passed
- [x] Browser windows opened:
  - http://localhost:3001/admin/projects (Admin)
  - http://localhost:3001/projects (Public)

---

## 🧪 Test Execution Steps

### Test 1: Initial State Verification

**Page**: Admin Projects (`/admin/projects`)

**Steps**:
1. ✅ Open browser DevTools (F12 or Cmd+Option+I)
2. ✅ Go to Console tab
3. ✅ Refresh the admin projects page
4. ✅ Observe the projects list

**Expected to See**:
- [ ] 5 projects displayed in the admin panel
- [ ] Toggle switches next to each project
- [ ] 4 projects with GREEN toggle + "Live" label
- [ ] 1 project ("The Nest") with GRAY toggle + "Draft" label

**Console Logs to Check**:
```
📊 Admin Projects - Fetching projects
📊 Admin Projects - Response: {status: 200, ok: true, statusText: ""}
📊 Admin Projects - Data: {count: 5, data: Array(5)}
```

**Screenshot**: Take screenshot of admin page showing all projects with their status

---

### Test 2: Public Page - Initial State

**Page**: Public Projects (`/projects`)

**Steps**:
1. ✅ Switch to the public projects tab
2. ✅ Open DevTools Console
3. ✅ Refresh the page
4. ✅ Count visible projects

**Expected to See**:
- [ ] Only 4 projects visible (Live projects only)
- [ ] "The Nest" is NOT visible (it's draft)
- [ ] Projects displayed:
  - No1 Östermalm
  - Wallin Revival
  - Grand Celeste
  - Classic Pearl

**Console Logs to Check**:
```
📊 Database returned projects: 5
Project No1 Östermalm: isPublished=true, data={...}
Project Wallin Revival: isPublished=true, data={...}
Project The Nest: isPublished=false, data={...}
Project Grand Celeste: isPublished=true, data={...}
Project Classic Pearl: isPublished=true, data={...}
📊 After filtering: 4 published projects
```

**Screenshot**: Take screenshot of public page showing only 4 projects

---

### Test 3: Toggle Live → Draft

**Page**: Admin Projects (`/admin/projects`)

**Steps**:
1. ✅ Switch back to admin tab
2. ✅ Find a LIVE project (e.g., "No1 Östermalm" - green toggle)
3. ✅ Click the toggle switch
4. ✅ Observe the animation and UI change
5. ✅ Check the console logs

**Expected to See**:
- [ ] Toggle animates smoothly from right to left
- [ ] Toggle changes from GREEN to GRAY
- [ ] Label changes from "Live" to "Draft"
- [ ] Toggle appears disabled briefly (during API call)
- [ ] Change happens within 1-2 seconds

**Console Logs to Check**:
```
Toggling project {id} to draft
🔍 Project data for toggle: {
  id: "...",
  title: "No1 Östermalm",
  projectImagesCount: X,
  imagePairsCount: Y
}
📤 Sending to API: {...}
📥 PUT Request for project: {id}
📊 Received data: {..., isPublished: false}
✅ Updated project in DB: {
  isPublished: false,
  publishedAt: null
}
✅ Refreshed all projects from database
✅ Successfully updated project {id} publish status to false
```

**Screenshot**: Take screenshot after toggle (showing draft state)

---

### Test 4: Verify Public Page Update (After Draft)

**Page**: Public Projects (`/projects`)

**Steps**:
1. ✅ Switch to public projects tab
2. ✅ Refresh the page (Cmd+R or Ctrl+R)
3. ✅ Count visible projects
4. ✅ Verify the toggled project is gone

**Expected to See**:
- [ ] Only 3 projects visible now (was 4 before)
- [ ] "No1 Östermalm" is NOT visible
- [ ] Projects displayed:
  - Wallin Revival
  - Grand Celeste
  - Classic Pearl
- [ ] "The Nest" still not visible (was already draft)

**Console Logs to Check**:
```
📊 Database returned projects: 5
📊 After filtering: 3 published projects
```

**Screenshot**: Take screenshot showing only 3 projects

---

### Test 5: Toggle Draft → Live

**Page**: Admin Projects (`/admin/projects`)

**Steps**:
1. ✅ Switch back to admin tab
2. ✅ Find a DRAFT project (e.g., "The Nest" - gray toggle)
3. ✅ Click the toggle switch
4. ✅ Observe the animation and UI change
5. ✅ Check the console logs

**Expected to See**:
- [ ] Toggle animates smoothly from left to right
- [ ] Toggle changes from GRAY to GREEN
- [ ] Label changes from "Draft" to "Live"
- [ ] Toggle appears disabled briefly (during API call)
- [ ] Change happens within 1-2 seconds

**Console Logs to Check**:
```
Toggling project {id} to published
🔍 Project data for toggle: {
  id: "...",
  title: "The Nest",
  projectImagesCount: X,
  imagePairsCount: Y
}
📤 Sending to API: {...}
📥 PUT Request for project: {id}
📊 Received data: {..., isPublished: true}
✅ Updated project in DB: {
  isPublished: true,
  publishedAt: "2025-10-14T..."
}
✅ Refreshed all projects from database
✅ Successfully updated project {id} publish status to true
```

**Screenshot**: Take screenshot after toggle (showing live state)

---

### Test 6: Verify Public Page Update (After Live)

**Page**: Public Projects (`/projects`)

**Steps**:
1. ✅ Switch to public projects tab
2. ✅ Refresh the page
3. ✅ Count visible projects
4. ✅ Verify the toggled project is now visible

**Expected to See**:
- [ ] 4 projects visible now (was 3 before)
- [ ] "The Nest" IS NOW visible
- [ ] Projects displayed:
  - Wallin Revival
  - Grand Celeste
  - Classic Pearl
  - The Nest (newly published)

**Console Logs to Check**:
```
📊 Database returned projects: 5
📊 After filtering: 4 published projects
```

**Screenshot**: Take screenshot showing 4 projects including "The Nest"

---

### Test 7: Restore Original State

**Page**: Admin Projects (`/admin/projects`)

**Steps**:
1. ✅ Switch back to admin tab
2. ✅ Toggle "The Nest" back to Draft
3. ✅ Toggle "No1 Östermalm" back to Live
4. ✅ Verify the original state is restored

**Expected to See**:
- [ ] "The Nest" is Draft again (gray toggle)
- [ ] "No1 Östermalm" is Live again (green toggle)
- [ ] Original state: 4 Live, 1 Draft

**Screenshot**: Take screenshot showing restored state

---

### Test 8: Persistence Check

**Steps**:
1. ✅ Hard refresh admin page (Cmd+Shift+R or Ctrl+Shift+F5)
2. ✅ Verify status is maintained
3. ✅ Close and reopen browser
4. ✅ Navigate to admin page again
5. ✅ Verify status is still maintained

**Expected to See**:
- [ ] Status unchanged after hard refresh
- [ ] Status unchanged after browser restart
- [ ] Database persistence confirmed

---

### Test 9: UI/UX Quality Check

**Page**: Admin Projects (`/admin/projects`)

**Quality Checklist**:
- [ ] Toggle animation is smooth (200ms)
- [ ] Visual states are clear (green vs gray)
- [ ] Labels are readable ("Live" vs "Draft")
- [ ] Toggle doesn't trigger navigation when clicked
- [ ] Loading state is visible (disabled during API call)
- [ ] No page jump or layout shift
- [ ] Works on different screen sizes
- [ ] Keyboard accessible (Tab to focus, Space/Enter to toggle)

**Screenshot**: Take screenshot showing toggle in various states

---

### Test 10: Error Handling Test

**Steps**:
1. ✅ Open DevTools → Network tab
2. ✅ Enable "Offline" mode (checkbox at top)
3. ✅ Try to toggle a project
4. ✅ Observe error handling
5. ✅ Disable "Offline" mode
6. ✅ Refresh page

**Expected to See**:
- [ ] Toggle shows loading state
- [ ] Network error appears in console
- [ ] Alert message: "Failed to update status"
- [ ] Toggle reverts to original position
- [ ] After coming online, original status is preserved

**Console Logs to Check**:
```
❌ Error updating project status: TypeError: Failed to fetch
```

---

### Test 11: Rapid Toggle Test

**Steps**:
1. ✅ Click toggle to Draft
2. ✅ Immediately click again to Live
3. ✅ Click again to Draft
4. ✅ Wait for all API calls to complete
5. ✅ Refresh page

**Expected to See**:
- [ ] Each toggle operation queues properly
- [ ] No race conditions
- [ ] Final status matches last toggle
- [ ] No stuck states
- [ ] Status persists correctly after refresh

---

### Test 12: Data Integrity Verification

**Steps**:
1. ✅ Note a project's details (images, title, content)
2. ✅ Toggle its status
3. ✅ Click into the project detail page
4. ✅ Verify all data is intact
5. ✅ Return to projects list

**Expected to See**:
- [ ] Title unchanged
- [ ] Hero image unchanged
- [ ] All project images present
- [ ] Image pairs intact
- [ ] Content/summary unchanged
- [ ] Facts/metadata unchanged

**Console Verification**:
```
🔍 Project data for toggle: {
  projectImagesCount: X,  // Should match original
  imagePairsCount: Y      // Should match original
}
```

---

## 📊 Test Results Summary

### Status Checklist
- [ ] Test 1: Initial State Verification - PASS/FAIL
- [ ] Test 2: Public Page Initial State - PASS/FAIL
- [ ] Test 3: Toggle Live → Draft - PASS/FAIL
- [ ] Test 4: Public Page Update (Draft) - PASS/FAIL
- [ ] Test 5: Toggle Draft → Live - PASS/FAIL
- [ ] Test 6: Public Page Update (Live) - PASS/FAIL
- [ ] Test 7: Restore Original State - PASS/FAIL
- [ ] Test 8: Persistence Check - PASS/FAIL
- [ ] Test 9: UI/UX Quality Check - PASS/FAIL
- [ ] Test 10: Error Handling Test - PASS/FAIL
- [ ] Test 11: Rapid Toggle Test - PASS/FAIL
- [ ] Test 12: Data Integrity Verification - PASS/FAIL

### Overall Result
- **Total Tests**: 12
- **Passed**: ___
- **Failed**: ___
- **Status**: PASS / FAIL

---

## 🐛 Issues Found

### Issue Template
```
Issue #1:
- Test: Test X - [Test Name]
- Severity: Critical / High / Medium / Low
- Description: [What went wrong]
- Expected: [What should happen]
- Actual: [What actually happened]
- Screenshot: [Attach screenshot]
- Console Logs: [Paste relevant logs]
- Steps to Reproduce:
  1. ...
  2. ...
  3. ...
```

---

## ✅ Success Criteria

All tests PASS when:
- ✅ Projects toggle between Draft and Live smoothly
- ✅ UI provides clear visual feedback
- ✅ Draft projects hidden from public pages
- ✅ Live projects appear on public pages
- ✅ Status persists after refresh/restart
- ✅ No data loss during status changes
- ✅ Error handling works correctly
- ✅ Console logs confirm operations
- ✅ No race conditions or stuck states
- ✅ UI/UX is polished and intuitive

---

## 📸 Screenshots Location

Save all screenshots with naming convention:
- `test-01-initial-admin.png`
- `test-02-initial-public.png`
- `test-03-toggle-to-draft.png`
- `test-04-public-after-draft.png`
- `test-05-toggle-to-live.png`
- `test-06-public-after-live.png`
- etc.

---

## 🎬 Screen Recording (Optional)

Consider recording a screen video showing:
1. Initial state
2. Toggling from Live to Draft
3. Verifying public page hides it
4. Toggling from Draft to Live
5. Verifying public page shows it
6. Final state restoration

---

## 📝 Additional Notes

### Browser Compatibility
- [ ] Chrome (Version: ___)
- [ ] Firefox (Version: ___)
- [ ] Safari (Version: ___)
- [ ] Edge (Version: ___)

### Performance Observations
- Toggle response time: ___ ms
- Page refresh time: ___ ms
- API call duration: ___ ms
- Any lag or delays: Yes / No

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with VoiceOver/NVDA)
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

---

## 🔗 Related Documentation

- **Test Plan**: `PROJECT_STATUS_TEST_PLAN.md`
- **Test Results**: `PROJECT_STATUS_TEST_RESULTS.md`
- **Automated Test**: `scripts/test-project-status.ts`

---

## 📅 Test Execution

**Executed by**: ___________  
**Date**: ___________  
**Duration**: ___________  
**Browser**: ___________  
**OS**: ___________  

**Final Status**: ✅ PASS / ❌ FAIL  

**Signature**: ___________

---

## 🚀 Quick Test Commands

```bash
# Start dev server (if not running)
npm run dev

# Open admin page
open http://localhost:3001/admin/projects

# Open public page
open http://localhost:3001/projects

# Run automated test for comparison
./scripts/test-status.sh

# Check current database state
npx tsx scripts/check-projects.ts
```

---

**Remember**: 
- Keep DevTools console open during all tests
- Take screenshots at each step
- Document any unexpected behavior
- Compare results with automated test output
- Note any differences between browsers

---

*Last Updated: October 14, 2025*

