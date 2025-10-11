# Supabase Auth Setup Guide

Complete guide for understanding and managing authentication in your EJ Development platform.

## Overview

Your application uses **Supabase Auth** for secure user authentication and authorization. This provides:
- Email/password authentication
- Magic link (passwordless) authentication
- Secure session management
- Row Level Security (RLS) policies
- Role-based access control (Admin/Editor)

## Architecture

### Authentication Flow

```
User → Login Page → Supabase Auth → Session Cookie → Protected Routes
```

1. **User** enters credentials or requests magic link
2. **Supabase Auth** validates and creates session
3. **Session cookie** stores authentication state
4. **Middleware** protects admin routes
5. **RLS policies** control database access based on user role

### Database Structure

```
auth.users (Supabase Auth)
   ↓ user_id
public.profiles
   - user_id (PK, FK to auth.users)
   - role (admin | editor)
   - created_at
   - updated_at
```

## User Roles

### Admin
- Full access to all features
- Can manage users (create, edit, delete)
- Can access settings and configurations
- Can manage all content

### Editor
- Can create and manage content
- Can access projects, editorials, listings, Instagram
- Cannot manage users or critical settings

## Components

### 1. Auth Helpers

**Location**: `src/lib/supabase/`

**Server-side client** (`server.ts`):
```typescript
import { createSupabaseServerClient } from "@/lib/supabase/server";

// In Server Components or Route Handlers
const supabase = createSupabaseServerClient();
const { data: { session } } = await supabase.auth.getSession();
```

**Client-side client** (`client.ts`):
```typescript
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// In Client Components
const supabase = createSupabaseBrowserClient();
await supabase.auth.signInWithPassword({ email, password });
```

**Admin client** (`server.ts`):
```typescript
import { createSupabaseAdminClient } from "@/lib/supabase/server";

// For admin operations (create users, etc.)
const supabase = createSupabaseAdminClient();
await supabase.auth.admin.createUser({ email, password });
```

### 2. Middleware

**Location**: `src/middleware.ts`

Protects all `/admin/*` routes:
- Checks for valid session
- Redirects to login if not authenticated
- Refreshes expired sessions automatically

### 3. Login Page

**Location**: `src/app/login/page.tsx`

Features:
- Email/password login
- Magic link (passwordless) option
- Error handling
- Redirect to intended page after login
- Loading states

### 4. Auth Callback

**Location**: `src/app/auth/callback/route.ts`

Handles OAuth/magic link callbacks:
- Exchanges code for session
- Sets cookies
- Redirects to destination

### 5. User Management

**Location**: `src/app/(admin)/admin/users/`

Admin interface for:
- Viewing all users
- Creating new users
- Editing user roles
- Deleting users

**API Routes**:
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

## Row Level Security (RLS)

### Helper Function

```sql
CREATE FUNCTION public.is_admin_or_editor()
RETURNS boolean
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
  );
$$;
```

### Policy Examples

**Public content (read-only)**:
```sql
CREATE POLICY "Public read published projects"
  ON public.projects
  FOR SELECT
  USING (is_published = true);
```

**Editor content management**:
```sql
CREATE POLICY "Editors manage projects"
  ON public.projects
  FOR ALL
  USING (public.is_admin_or_editor());
```

## Environment Variables

Required in `.env.local`:

```env
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
SUPABASE_DB_POOL_URL=postgresql://...
SUPABASE_DB_URL=postgresql://...
DIRECT_URL=postgresql://...
```

## Common Tasks

### Creating the First Admin User

1. **Via Supabase Dashboard**:
   - Go to Authentication → Users
   - Click "Add user"
   - Enter email and password
   - Copy the user UUID

2. **Create profile in database**:
   ```sql
   INSERT INTO profiles (user_id, role)
   VALUES ('user-uuid-here', 'admin');
   ```

3. **Or use the API** (after creating first admin manually):
   - Go to `/admin/users`
   - Click "Add User"
   - Enter email and select "Admin" role

### Changing User Role

**Via Admin UI**:
1. Navigate to `/admin/users`
2. Click "Edit" on user card
3. Change role dropdown
4. Click "Save Changes"

**Via SQL**:
```sql
UPDATE profiles
SET role = 'admin', updated_at = NOW()
WHERE user_id = 'user-uuid';
```

### Resetting User Password

**Via Supabase Dashboard**:
1. Authentication → Users
2. Click on user
3. Click "Send Password Recovery"

**Via API** (admin only):
```typescript
const supabase = createSupabaseAdminClient();
await supabase.auth.admin.updateUserById(userId, {
  password: 'new-password'
});
```

### Revoking Sessions

```typescript
const supabase = createSupabaseAdminClient();
await supabase.auth.admin.signOut(userId);
```

## Testing Auth Locally

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Create Test User

Via Supabase Dashboard or use this SQL:
```sql
-- This requires Supabase service role key
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('test@example.com', crypt('password123', gen_salt('bf')), NOW());

-- Get the user_id and create profile
INSERT INTO profiles (user_id, role)
VALUES ('user-uuid-from-above', 'admin');
```

### 3. Test Login

1. Go to `http://localhost:3000/login`
2. Enter credentials
3. Should redirect to `/admin`

### 4. Test Protected Routes

- Try accessing `/admin` without logging in → redirects to `/login`
- Log in → can access `/admin/*` routes
- Log out → redirected back to login

## Security Best Practices

### ✅ Do's

1. **Always use RLS policies** - Never bypass with service role in client code
2. **Validate roles** - Check user role before sensitive operations
3. **Use HTTPS** - Required for production (Supabase enforces this)
4. **Rotate keys** - Periodically regenerate API keys
5. **Audit logs** - Monitor auth events in Supabase dashboard

### ❌ Don'ts

1. **Never expose service role key** - Only use server-side
2. **Don't store passwords** - Let Supabase handle this
3. **Don't skip middleware** - Always protect admin routes
4. **Don't trust client** - Validate everything server-side
5. **Don't hardcode credentials** - Use environment variables

## Troubleshooting

### "User not authorized" error

**Cause**: User doesn't have required role in profiles table

**Fix**:
```sql
INSERT INTO profiles (user_id, role)
VALUES ('user-uuid', 'admin')
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin';
```

### Redirect loop on `/admin`

**Cause**: Session cookie not being set properly

**Fix**:
1. Clear browser cookies for localhost
2. Check middleware configuration
3. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### "Invalid JWT" error

**Cause**: Expired or corrupted session

**Fix**:
- Log out and log back in
- Clear cookies
- Check token expiration settings in Supabase

### Can't create users via API

**Cause**: Missing or invalid `SUPABASE_SERVICE_ROLE_KEY`

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy "service_role" key (NOT anon key)
3. Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
4. Restart dev server

## Migration Checklist

When deploying or setting up new environment:

- [ ] Set up Supabase project
- [ ] Add environment variables
- [ ] Run database migrations (`npm run db:push`)
- [ ] Apply RLS policies (included in migrations)
- [ ] Create first admin user
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test user management
- [ ] Configure email templates (optional)
- [ ] Set up custom domain (production)
- [ ] Enable email confirmations (production)

## Email Templates

Customize in Supabase Dashboard → Authentication → Email Templates:

- **Confirm signup** - When user signs up
- **Magic Link** - Passwordless login
- **Change Email Address** - Email change verification
- **Reset Password** - Password reset link

## Advanced Features

### Custom Claims

Add custom data to JWT:
```typescript
const supabase = createSupabaseAdminClient();
await supabase.auth.admin.updateUserById(userId, {
  user_metadata: {
    full_name: "John Doe",
    department: "Sales"
  }
});
```

### Session Refresh

Automatic in middleware, manual:
```typescript
const supabase = createSupabaseBrowserClient();
const { data, error } = await supabase.auth.refreshSession();
```

### Multi-factor Authentication (MFA)

Enable in Supabase Dashboard → Authentication → Providers → MFA

## Support & Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Supabase Dashboard**: https://supabase.com/dashboard

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready

