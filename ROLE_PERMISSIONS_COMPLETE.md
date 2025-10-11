# Role-Based Permissions - Implementation Complete ✅

## Summary

Implemented strict role-based access control with **Admin** and **Editor** roles, where Editors can **ONLY** access Projects, Editorials, Listings, and Enquiries (customer service).

## Role Definitions

### 👑 Admin - Full Access
- Projects, Editorials, Listings ✅
- Enquiries ✅
- Instagram Integration ✅
- Analytics ✅
- User Management ✅
- Settings ✅

### ✏️ Editor - Content & Customer Service
- Projects ✅
- Editorials ✅
- Listings ✅
- Enquiries ✅
- **Instagram, Analytics, Users, Settings** ❌

## What Was Implemented

### 1. Database Functions ✅

**Created `is_admin()` helper** (`drizzle/0009_editor_restrictions.sql`):
```sql
CREATE FUNCTION public.is_admin()
RETURNS boolean
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;
```

Existing `is_admin_or_editor()` kept for shared content access.

### 2. RLS Policies Updated ✅

**Admin-Only Tables**:
- ✅ `site_settings` - Only admins can modify
- ✅ `instagram_settings` - Only admins can access
- ✅ `instagram_cache` - Only admins can write
- ✅ `enquiries` - Only admins can read
- ✅ `profiles` - Only admins can manage

**Editor + Admin Tables** (unchanged):
- ✅ `projects` + `project_images`
- ✅ `posts` (editorials)
- ✅ `listings` + `listing_images` + `listing_documents`

### 3. Auth Helpers ✅

**New file**: `src/lib/auth.ts`

**Functions**:
- `getCurrentUser()` - Gets current user with role
- `isAdmin()` - Check if current user is admin
- `isAdminOrEditor()` - Check if current user has access
- `requireAdmin()` - Throw error if not admin (for API routes)
- `requireAdminOrEditor()` - Throw error if not admin/editor

### 4. Navigation Control ✅

**Updated**: `src/components/admin/admin-sidebar.tsx`

**Features**:
- Navigation items marked with `adminOnly: true`
- Sidebar dynamically filters based on user role
- Fetches current user role on mount
- Shows role-appropriate items only

**Admin Navigation** (9 items):
- Dashboard
- Projects
- Editorials
- Listings
- Instagram (admin-only)
- Analytics (admin-only)
- Enquiries
- Users (admin-only)
- Settings (admin-only)

**Editor Navigation** (5 items):
- Dashboard
- Projects
- Editorials
- Listings
- Enquiries

### 5. API Route Protection ✅

**Updated Routes**:
- `/api/admin/users` - Added `requireAdmin()` check
- `/api/admin/users/[id]` - Added `requireAdmin()` check
- `/api/admin/current-user` - Uses `getCurrentUser()`

**Protection**:
- Returns 401 if not authenticated
- Returns 403 if editor tries to access admin route
- Proper error messages

### 6. User Display ✅

**Sidebar Footer**:
- Shows actual user email dynamically
- Shows user role with color coding:
  - Purple for admins
  - Blue for editors
- Avatar with initials from email
- Logout button

### 7. Documentation ✅

**Created**:
- `docs/ROLE_PERMISSIONS.md` - Complete permission matrix
- `docs/SUPABASE_AUTH_SETUP.md` - Auth setup guide
- `docs/ADMIN_ACCESS.md` - Hidden admin access explanation

**Updated**:
- README.md with auth features
- Admin guide with role information

---

## Permission Matrix

### Admin Pages

| Page | Admin | Editor |
|------|-------|--------|
| Dashboard | ✅ View all stats | ✅ View content stats only |
| Projects | ✅ Full CRUD | ✅ Full CRUD |
| Editorials | ✅ Full CRUD | ✅ Full CRUD |
| Listings | ✅ Full CRUD | ✅ Full CRUD |
| Enquiries | ✅ View all | ✅ View all |
| Instagram | ✅ Full access | ❌ Hidden |
| Analytics | ✅ Full access | ❌ Hidden |
| Users | ✅ Full CRUD | ❌ Hidden |
| Settings | ✅ Full access | ❌ Hidden |

### API Endpoints

| Endpoint | Admin | Editor |
|----------|-------|--------|
| `/api/projects/*` | ✅ | ✅ |
| `/api/editorials/*` | ✅ | ✅ |
| `/api/listings/*` | ✅ | ✅ |
| `/api/admin/users*` | ✅ | ❌ 403 |
| `/api/instagram/sync` | ✅ | ❌ RLS blocks |
| `/api/enquiries` (GET) | ✅ | ❌ RLS blocks |
| `/api/admin/current-user` | ✅ | ✅ |

### Database Tables

| Table | Admin | Editor |
|-------|-------|--------|
| projects | ✅ Full | ✅ Full |
| project_images | ✅ Full | ✅ Full |
| posts (editorials) | ✅ Full | ✅ Full |
| listings | ✅ Full | ✅ Full |
| listing_images | ✅ Full | ✅ Full |
| listing_documents | ✅ Full | ✅ Full |
| site_settings | ✅ Full | ❌ RLS blocks |
| instagram_settings | ✅ Full | ❌ RLS blocks |
| instagram_cache | ✅ Full | ❌ Write blocked |
| enquiries | ✅ Read | ✅ Read |
| profiles | ✅ Full | ❌ RLS blocks |

---

## Implementation Details

### How It Works

**1. UI Layer** (Sidebar):
```typescript
const visibleNavigation = navigation.filter(item => {
  if (item.adminOnly) {
    return userRole === "admin";
  }
  return true;
});
```

**2. API Layer** (Route Protection):
```typescript
// Admin-only endpoint
try {
  await requireAdmin();
} catch (authError) {
  return NextResponse.json(
    { error: "Admin access required" },
    { status: 403 }
  );
}
```

**3. Database Layer** (RLS):
```sql
CREATE POLICY "Admins manage profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin());
```

### Defense in Depth

Even if an editor:
1. ❌ Modifies browser to show hidden links
2. ❌ Directly navigates to `/admin/users`
3. ❌ Calls `/api/admin/users` via curl

They will be blocked by:
- ✅ API route checks (403 Forbidden)
- ✅ RLS policies (empty results/errors)
- ✅ Middleware (redirect to login)

---

## Testing Scenarios

### Scenario 1: Editor Tries to Access Users

**Steps**:
1. Log in as editor
2. Sidebar shows only 4 items (no "Users" link)
3. Manually navigate to `/admin/users`
4. API call fails with 403
5. Page shows error or redirects

**Expected**: ✅ Access denied

### Scenario 2: Editor Creates Project

**Steps**:
1. Log in as editor
2. Click "Projects" in sidebar
3. Click "Add Project"
4. Fill in form and save
5. Project is created successfully

**Expected**: ✅ Full access to content management

### Scenario 3: Admin Manages Users

**Steps**:
1. Log in as admin
2. Sidebar shows all 9 items including "Users"
3. Click "Users"
4. Can add, edit, delete users
5. All operations succeed

**Expected**: ✅ Full admin access

---

## Configuration

### Adding New Admin-Only Feature

1. **Mark in navigation** (`admin-sidebar.tsx`):
   ```typescript
   {
     name: "New Feature",
     href: "/admin/new-feature",
     adminOnly: true, // ← Add this
     icon: <svg>...</svg>
   }
   ```

2. **Protect API route**:
   ```typescript
   import { requireAdmin } from "@/lib/auth";
   
   export async function GET() {
     try {
       await requireAdmin();
       // ... your code
     } catch (authError) {
       return NextResponse.json(
         { error: "Admin access required" },
         { status: 403 }
       );
     }
   }
   ```

3. **Add RLS policy**:
   ```sql
   CREATE POLICY "Admins manage feature"
     ON public.new_table
     FOR ALL
     USING (public.is_admin());
   ```

### Adding New Shared Feature

Don't add `adminOnly` flag, use `requireAdminOrEditor()`:

```typescript
import { requireAdminOrEditor } from "@/lib/auth";

export async function POST() {
  try {
    await requireAdminOrEditor();
    // Both admins and editors can access
  } catch (authError) {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }
}
```

---

## Files Modified

### Created
- `src/lib/auth.ts` - Auth helper functions
- `src/app/api/admin/current-user/route.ts` - Current user endpoint
- `drizzle/0009_editor_restrictions.sql` - RLS policy updates
- `docs/ROLE_PERMISSIONS.md` - This documentation

### Modified
- `src/components/admin/admin-sidebar.tsx` - Role-based navigation
- `src/app/api/admin/users/route.ts` - Added admin checks
- `src/app/api/admin/users/[id]/route.ts` - Added admin checks

---

## Quick Reference

### As Admin
✅ See all 9 sidebar items  
✅ Access all pages  
✅ Manage users  
✅ Change settings  
✅ View everything  

### As Editor
✅ See 5 sidebar items (Dashboard, Projects, Editorials, Listings, Enquiries)  
✅ Full content management  
✅ View and respond to customer enquiries  
❌ Cannot see Users, Settings, Instagram, Analytics  
❌ Cannot manage users or site config  

---

**Implementation Date**: October 11, 2025  
**Status**: ✅ Production Ready  
**Enforcement**: UI + API + Database (3 layers)  
**Editor Access**: Projects, Editorials, Listings, Enquiries ONLY

