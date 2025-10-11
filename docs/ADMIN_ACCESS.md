# Admin Access - Hidden Dashboard

## Design Philosophy

The admin dashboard is **intentionally hidden** from public view:
- ✅ No login buttons on the public website
- ✅ No links to admin panel anywhere
- ✅ Only accessible by knowing the URL
- ✅ Protected by authentication

This provides a clean public experience while maintaining secure admin access.

## Accessing the Admin Panel

### For Administrators

1. **Navigate directly to the admin URL**:
   ```
   https://yourdomain.com/admin
   ```
   Or locally:
   ```
   http://localhost:3000/admin
   ```

2. **If not logged in**: You'll be redirected to `/login`

3. **Enter your credentials**:
   - Email address
   - Password
   - Or use "Send Magic Link" for passwordless login

4. **After successful login**: You'll be redirected to the admin dashboard

### First Time Setup

The first admin user must be created manually via Supabase Dashboard:

1. **Go to Supabase Dashboard** → Authentication → Users
2. **Click "Add user"**
3. **Enter email and generate password**
4. **Copy the user UUID**
5. **Run this SQL**:
   ```sql
   INSERT INTO profiles (user_id, role)
   VALUES ('user-uuid-here', 'admin');
   ```

After that, admins can create additional users via `/admin/users`.

## Security Model

### Public Site
- **Header**: Home, Projects, Editorials, Instagram, Studio, Contact
- **Footer**: Contact info, social links, legal pages
- **No admin hints**: Zero indication that an admin panel exists

### Admin Routes
All routes under `/admin/*` are protected by:

1. **Middleware** (`src/middleware.ts`)
   - Checks for valid session
   - Redirects to login if not authenticated
   - Refreshes expired sessions

2. **Row Level Security (RLS)**
   - Database policies enforce role-based access
   - Only admin/editor roles can modify content
   - Service calls validate permissions

3. **API Protection**
   - User management requires service role key
   - All mutations validate authentication
   - Audit trail via timestamps

## Admin URLs

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard overview |
| `/admin/projects` | Manage projects |
| `/admin/editorials` | Manage editorials |
| `/admin/listings` | Manage property listings |
| `/admin/instagram` | Instagram integration |
| `/admin/users` | User management (admins only) |
| `/admin/enquiries` | View contact enquiries |
| `/admin/settings` | Site settings |
| `/login` | Authentication page |

## Sharing Admin Access

When onboarding new admins:

### Option 1: Email Them
```
Subject: Admin Access - EJ Properties

You've been granted admin access to the EJ Properties platform.

Admin URL: https://yourdomain.com/admin
Your email: their@email.com
Password: [send separately or use magic link]

Use the magic link option if you prefer passwordless login.
```

### Option 2: Create Via Admin Panel
1. Log in to `/admin`
2. Go to `/admin/users`
3. Click "Add User"
4. Enter their email and select role
5. They'll receive an email with credentials

## Important Notes

### ✅ Best Practices
- **Share admin URL privately** - Don't post it publicly
- **Use strong passwords** - Or magic links for better security
- **Regular audits** - Review user list periodically
- **Revoke access quickly** - Delete users who no longer need access
- **HTTPS only** - Never use admin panel over HTTP in production

### ⚠️ Security Reminders
- The URL `/admin` is not "secret" - security relies on authentication
- Anyone can type `/admin` in browser, but they'll hit the login wall
- RLS policies provide defense-in-depth even if auth is bypassed
- Always use HTTPS in production (Supabase enforces this)

### 🔒 What Protects You
1. **Authentication** - Can't access without valid credentials
2. **Authorization** - Role checks before sensitive operations  
3. **RLS Policies** - Database enforces permissions
4. **Session Management** - Automatic expiration and refresh
5. **Audit Trail** - All changes tracked with timestamps

## Common Scenarios

### "I forgot the admin URL"
It's simply: `your-domain.com/admin`

### "How do I share with my team?"
Create users via `/admin/users` or share the URL privately via email/message.

### "What if someone guesses /admin?"
They'll see the login page. Without credentials, they can't proceed.

### "Can I add a login button?"
You can, but it's intentionally hidden. If you want to add one:
```tsx
<Link href="/admin">Admin</Link>
```
But this defeats the purpose of keeping it hidden.

### "What about bots/scanners?"
Bots may find `/admin` and `/login`, but authentication prevents access. RLS provides additional protection.

## Troubleshooting

### Can't access /admin
- Clear browser cache and cookies
- Try incognito/private mode
- Verify you're using correct URL
- Check if you're logged in

### Stuck in redirect loop
- Clear cookies for your domain
- Check middleware configuration
- Verify session is being set properly

### Changes not saving
- Check if your user has correct role (admin/editor)
- Verify database connection
- Check browser console for errors

---

**Security Level**: Hidden URL + Authentication + Authorization  
**Access Method**: Direct URL only (no public links)  
**Login Required**: Yes (all /admin/* routes)  
**Status**: ✅ Configured Correctly

