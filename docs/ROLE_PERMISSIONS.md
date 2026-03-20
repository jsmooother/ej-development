# Role-Based Permissions

Complete reference for admin and editor access levels in the EJ Properties platform.

## Role Overview

| Role | Access Level | Use Case |
|------|--------------|----------|
| **Admin** | Full access | Owner, technical lead, trusted managers |
| **Editor** | Content only | Content creators, photographers, writers |

---

## Admin Role

### ✅ Full Access To:

**Dashboard & Analytics**
- `/admin` - Dashboard overview
- `/admin/analytics` - Analytics and insights

**Content Management**
- `/admin/projects` - Manage projects (create, edit, delete, publish)
- `/admin/editorials` - Manage editorials (create, edit, delete, publish)
- `/admin/listings` - Manage property listings (create, edit, delete, publish)

**User & Access Management**
- `/admin/users` - Manage admin and editor users
- Create new users (both admin and editor)
- Edit user roles
- Delete users

**Site Configuration**
- `/admin/settings` - Site settings and configuration
- `/admin/instagram` - Instagram integration settings
- `/admin/enquiries` - View contact form submissions

**API Access**
- All `/api/admin/*` endpoints
- All `/api/projects/*` endpoints
- All `/api/editorials/*` endpoints
- All `/api/listings/*` endpoints

### Database Permissions (RLS)
- ✅ Read/write all tables
- ✅ Manage site_settings
- ✅ View enquiries
- ✅ Manage Instagram settings
- ✅ Manage user profiles

---

## Editor Role

### ✅ Limited Access To:

**Content Management & Customer Service**
- `/admin` - Dashboard overview (read-only stats)
- `/admin/projects` - Manage projects
- `/admin/editorials` - Manage editorials  
- `/admin/listings` - Manage property listings
- `/admin/enquiries` - View and respond to contact enquiries

**What Editors Can Do:**
- Create new projects, editorials, listings
- Edit existing content
- Publish/unpublish content
- Upload and manage images
- Set hero projects
- Manage content metadata
- View and respond to customer enquiries

### ❌ NO Access To:

**Restricted Routes**
- ❌ `/admin/users` - Cannot manage users
- ❌ `/admin/settings` - Cannot change site settings
- ❌ `/admin/instagram` - Cannot manage Instagram integration
- ❌ `/admin/analytics` - Cannot view analytics

**Restricted API Endpoints**
- ❌ `/api/admin/users` - Cannot manage users
- ❌ Site settings APIs
- ❌ Instagram management APIs

**Restricted Database Tables**
- ❌ `profiles` - Cannot read or modify user profiles
- ❌ `site_settings` - Cannot modify site settings
- ❌ `instagram_settings` - Cannot access Instagram config

### Database Permissions (RLS)
- ✅ Read/write: `projects`, `project_images`
- ✅ Read/write: `posts` (editorials)
- ✅ Read/write: `listings`, `listing_images`, `listing_documents`
- ✅ Read only: `enquiries` (can view customer enquiries)
- ❌ All other tables (protected by RLS)

---

## Sidebar Navigation

### Admin Sees:
```
- Dashboard
- Projects         ✅
- Editorials       ✅
- Listings         ✅
- Instagram        ✅ (admin only)
- Analytics        ✅ (admin only)
- Enquiries        ✅
- Users            ✅ (admin only)
- Settings         ✅ (admin only)
```

### Editor Sees:
```
- Dashboard
- Projects         ✅
- Editorials       ✅
- Listings         ✅
- Enquiries        ✅
```

**Note**: Editors will see 5 items in the sidebar. Instagram, Analytics, Users, and Settings are admin-only and completely hidden from editors.

---

## Permission Enforcement

### Layer 1: UI (Sidebar)
- Navigation items marked `adminOnly: true` are hidden from editors
- Editors don't see links to restricted pages

### Layer 2: Middleware
- All `/admin/*` routes require authentication
- Redirects to login if not authenticated

### Layer 3: API Routes
- Admin-only routes use `requireAdmin()` helper
- Returns 403 Forbidden if editor tries to access
- Returns 401 Unauthorized if not logged in

### Layer 4: Database (RLS)
- PostgreSQL policies enforce permissions at data level
- Editors cannot query restricted tables
- Admins have full database access via policies

---

## Use Cases

### Content Editor Workflow

**Emily (Editor)** can:
1. Log in at `/admin`
2. Navigate to Projects, Editorials, or Listings
3. Create new content
4. Edit existing content
5. Publish/unpublish content
6. Upload images
7. Log out

**Emily cannot**:
- View or create users
- Change site settings
- Access Instagram integration
- View contact enquiries
- See analytics

### Admin Workflow

**Jesper (Admin)** can:
1. Everything Emily can do
2. Plus: Manage users
3. Plus: Configure site settings
4. Plus: Manage Instagram
5. Plus: View enquiries
6. Plus: Access analytics

---

## API Endpoint Permissions

| Endpoint | Admin | Editor | Public |
|----------|-------|--------|--------|
| `GET /api/projects` | ✅ | ✅ | ✅ (published only) |
| `POST /api/projects/create` | ✅ | ✅ | ❌ |
| `PATCH /api/projects/[id]` | ✅ | ✅ | ❌ |
| `DELETE /api/projects/[id]` | ✅ | ✅ | ❌ |
| `GET /api/editorials` | ✅ | ✅ | ✅ (published only) |
| `POST /api/editorials/create` | ✅ | ✅ | ❌ |
| `PATCH /api/editorials/[id]` | ✅ | ✅ | ❌ |
| `DELETE /api/editorials/[id]` | ✅ | ✅ | ❌ |
| `GET /api/listings` | ✅ | ✅ | ✅ (published only) |
| `POST /api/listings` | ✅ | ✅ | ❌ |
| `PATCH /api/listings/[id]` | ✅ | ✅ | ❌ |
| `DELETE /api/listings/[id]` | ✅ | ✅ | ❌ |
| `GET /api/admin/users` | ✅ | ❌ | ❌ |
| `POST /api/admin/users` | ✅ | ❌ | ❌ |
| `PATCH /api/admin/users/[id]` | ✅ | ❌ | ❌ |
| `DELETE /api/admin/users/[id]` | ✅ | ❌ | ❌ |
| `GET /api/admin/current-user` | ✅ | ✅ | ❌ |
| `POST /api/instagram/sync` | ✅ | ❌ | ❌ |
| `GET /api/enquiries` | ✅ | ❌ | ❌ |
| `POST /api/enquiries` | ✅ | ✅ | ✅ |

---

## Testing Permissions

### Test Editor Access

1. Create editor user
2. Log in as editor
3. Verify sidebar only shows: Dashboard, Projects, Editorials, Listings
4. Try to access `/admin/users` directly → should see error or redirect
5. Try API call to `/api/admin/users` → should return 403

### Test Admin Access

1. Log in as admin
2. Verify sidebar shows all 9 items
3. Access all routes successfully
4. Create/edit/delete users
5. All API calls work

---

## Security Checklist

When adding new features:

- [ ] Is this admin-only? Add `adminOnly: true` to navigation
- [ ] Add role check in API route using `requireAdmin()` or `requireAdminOrEditor()`
- [ ] Add RLS policy to database table
- [ ] Test with both admin and editor accounts
- [ ] Document permissions in this file

---

## Future Enhancements

Potential role features for future releases:
- Viewer role (read-only access)
- Content-specific permissions (e.g., can only edit own content)
- Approval workflows (editor creates, admin approves)
- Activity logs (track who changed what)
- Permission groups/teams

---

**Last Updated**: October 11, 2025  
**Version**: 1.0  
**Status**: ✅ Implemented & Enforced

