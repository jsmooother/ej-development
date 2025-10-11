# Deployment Plan - Instagram Integration & Auth System

## Current Status ✅

**Branch**: `feature/admin-improvements`  
**Changes**: 
- Instagram Basic Display API integration (OAuth 2.0)
- User management system with cards and modal
- Supabase Auth implementation (login, middleware, callbacks)
- Role-based permissions (Admin vs Editor)
- Hidden admin access (no public links)

**Files Changed**: 24 new files, 6 modified files

---

## Recommended Next Steps

### Phase 1: Local Testing & Validation (Do This First!) 🧪

**Before committing anything, test locally:**

#### 1.1 Create First Admin User

**Via Supabase Dashboard**:
```
1. Go to: https://supabase.com/dashboard
2. Navigate to: Authentication → Users
3. Click: "Add user" or "Invite user"
4. Enter email: your-email@example.com
5. Set password or auto-generate
6. Copy the User UUID
```

**Create Profile in Database**:
```bash
# Option A: Via Supabase SQL Editor
INSERT INTO profiles (user_id, role)
VALUES ('your-user-uuid-here', 'admin');

# Option B: Via local script (create if needed)
```

#### 1.2 Test Authentication Flow

```bash
# 1. Make sure dev server is running
npm run dev

# 2. Test login
- Navigate to: http://localhost:3000/admin
- Should redirect to: http://localhost:3000/login
- Enter your credentials
- Should redirect to: http://localhost:3000/admin
- Verify you see 9 sidebar items

# 3. Test logout
- Click logout button in sidebar
- Should redirect to /login

# 4. Test magic link
- Go to /login
- Enter email, click "Send Magic Link"
- Check email for link
- Click link, should log you in
```

#### 1.3 Test User Management

```bash
# Navigate to: http://localhost:3000/admin/users
- Click "Add User"
- Create editor user: editor@example.com
- Verify user appears in grid
- Click "Edit" on user
- Change role to admin, save
- Delete test user
```

#### 1.4 Test Editor Permissions

```bash
# 1. Create editor user (if you deleted it)
# 2. Log out
# 3. Log in as editor
- Verify sidebar shows ONLY 4 items
- Try to navigate to /admin/users → should fail
- Try to navigate to /admin/settings → should fail
- Verify can access /admin/projects → should work
```

#### 1.5 Test Instagram Integration (Optional)

```bash
# Only if you have Instagram credentials
# 1. Add to .env.local:
INSTAGRAM_APP_ID=...
INSTAGRAM_APP_SECRET=...
NEXT_PUBLIC_INSTAGRAM_APP_ID=...

# 2. Restart server
# 3. Navigate to /admin/instagram
# 4. Click "Connect Instagram"
# 5. Authorize
# 6. Click "Sync Now"
# 7. Verify posts appear
```

---

### Phase 2: Commit Changes 💾

**Once local testing passes:**

```bash
# 1. Review changes
git status
git diff

# 2. Add all changes
git add -A

# 3. Commit with descriptive message
git commit -m "feat: implement Instagram integration and user management

- Add Instagram OAuth 2.0 integration with auto-sync
- Implement user management with role-based permissions
- Add Supabase Auth (login, middleware, callbacks)
- Restrict editor access to projects/editorials/listings only
- Add hidden admin access (no public login buttons)
- Create comprehensive documentation

Features:
- Instagram: OAuth flow, token refresh, post syncing
- Users: Add/edit/delete with cards and modal UI
- Auth: Email/password and magic link support
- Roles: Admin (full) vs Editor (content only)
- Security: 3-layer enforcement (UI, API, RLS)

Migration files:
- 0007_instagram_settings.sql
- 0008_instagram_policies.sql  
- 0009_editor_restrictions.sql"

# 4. Push to feature branch
git push origin feature/admin-improvements
```

---

### Phase 3: Pre-Merge Testing 🔍

**Before merging to main:**

```bash
# 1. Create pull request (if using GitHub)
# Review changes in PR
# Check no secrets committed
# Verify .env.local not included

# 2. Switch to main locally and test
git checkout main
git pull origin main
npm install
npm run dev
# Verify main branch still works

# 3. Switch back to feature branch
git checkout feature/admin-improvements
```

---

### Phase 4: Merge to Main 🔀

**After testing passes:**

```bash
# Option A: Merge via GitHub PR (recommended)
# 1. Go to GitHub → Pull Requests
# 2. Review the PR
# 3. Click "Merge pull request"
# 4. Delete feature branch

# Option B: Local merge
git checkout main
git merge feature/admin-improvements
git push origin main

# Delete feature branch
git branch -d feature/admin-improvements
git push origin --delete feature/admin-improvements
```

---

### Phase 5: Vercel Deployment 🚀

#### 5.1 Configure Vercel Environment Variables

**In Vercel Dashboard → Settings → Environment Variables, add:**

```env
# Database (from Supabase)
SUPABASE_DB_URL=postgresql://...
SUPABASE_DB_POOL_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Instagram (if using)
INSTAGRAM_APP_ID=...
INSTAGRAM_APP_SECRET=...
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/instagram/callback
NEXT_PUBLIC_INSTAGRAM_APP_ID=...
```

**Important**: Add to **all environments** (Production, Preview, Development)

#### 5.2 Update Instagram Redirect URI

**If using Instagram**:
1. Go to Facebook Developers
2. Navigate to your app → Instagram Basic Display
3. Add production callback URL:
   ```
   https://yourdomain.com/api/instagram/callback
   ```

#### 5.3 Deploy to Vercel

```bash
# Option A: Auto-deploy
# Push to main → Vercel auto-deploys

# Option B: Manual deploy
vercel --prod

# Option C: Via Vercel dashboard
# Dashboard → Deployments → Redeploy
```

#### 5.4 Run Production Migrations

**After first deployment**:

```bash
# Connect to production database
# Run migrations via Supabase SQL Editor or:

# 1. Set production DB URL locally
export DIRECT_URL="your-production-db-url"

# 2. Run migrations
npx tsx scripts/apply-migrations.ts

# OR paste SQL files directly in Supabase Dashboard
```

---

### Phase 6: Production Testing 🌐

**After deployment, test everything:**

#### 6.1 Create Production Admin User

```sql
-- Via Supabase Dashboard → SQL Editor
INSERT INTO profiles (user_id, role)
VALUES ('user-uuid-from-supabase-auth', 'admin');
```

#### 6.2 Test Authentication

```
1. Navigate to: https://yourdomain.com/admin
   → Should redirect to /login
2. Log in with admin credentials
   → Should redirect to /admin
3. Verify all features work
4. Test logout
```

#### 6.3 Test Public Site

```
1. Open in incognito: https://yourdomain.com
2. Verify NO login buttons anywhere
3. Check header and footer
4. Verify public pages load correctly
5. Try /admin → should redirect to login
```

#### 6.4 Test User Management

```
1. Log in as admin
2. Go to /admin/users
3. Create editor user
4. Log out
5. Log in as editor
6. Verify only 4 sidebar items
7. Try to access /admin/users → should fail
```

#### 6.5 Test Instagram (if configured)

```
1. Log in as admin
2. Go to /admin/instagram
3. Connect Instagram
4. Sync posts
5. Check /instagram page on public site
```

---

## Recommended Order

### ✅ Immediate (Before Committing)

1. **Local testing** - Test everything locally first
2. **Create first admin user** - Via Supabase Dashboard
3. **Test login flow** - Verify auth works
4. **Test user management** - Create/edit/delete users
5. **Test role restrictions** - Login as editor, verify limited access

### ✅ Next (After Local Testing Passes)

6. **Commit changes** - With descriptive commit message
7. **Push to feature branch**
8. **Review changes** - Check git diff
9. **Merge to main** - Via PR or local merge

### ✅ Then (Deployment)

10. **Configure Vercel env vars** - All required variables
11. **Deploy to Vercel** - Push to main or manual deploy
12. **Run production migrations** - Via Supabase or script
13. **Create production admin** - First user in production
14. **Test production** - Full auth and feature testing
15. **Update Instagram redirect** - Production callback URL

---

## Pre-Deployment Checklist

### Code
- [ ] All local tests pass
- [ ] No linter errors
- [ ] No console errors in browser
- [ ] All features work as expected
- [ ] Documentation is complete

### Database
- [ ] Migrations applied locally
- [ ] Test admin user created
- [ ] RLS policies tested
- [ ] Sample data works

### Environment
- [ ] `.env.local` has all required vars
- [ ] No secrets in git
- [ ] `.gitignore` includes `.env.local`
- [ ] Environment variable docs complete

### Authentication
- [ ] Can log in
- [ ] Can log out
- [ ] Protected routes work
- [ ] Magic link works
- [ ] Middleware redirects correctly

### User Management
- [ ] Can create users
- [ ] Can edit roles
- [ ] Can delete users
- [ ] Admin sees all features
- [ ] Editor sees limited features

### Instagram (if using)
- [ ] OAuth flow works
- [ ] Posts sync correctly
- [ ] Token refresh works
- [ ] Public page displays posts

---

## Post-Deployment Tasks

### Immediate
1. Test production login
2. Create production users
3. Configure Instagram (if using)
4. Test all public pages
5. Monitor error logs

### Within 24 Hours
1. Create editor test user
2. Test editor permissions
3. Create real content
4. Sync Instagram posts
5. Set up monitoring/alerts

### Within Week
1. Configure email templates in Supabase
2. Set up custom domain (if needed)
3. Enable additional Supabase features
4. Create user documentation for editors
5. Plan future enhancements

---

## Rollback Plan

If issues arise in production:

```bash
# Option 1: Revert deployment in Vercel
# Dashboard → Deployments → Previous deployment → Promote to Production

# Option 2: Revert git commit
git revert HEAD
git push origin main

# Option 3: Emergency fix
# Create hotfix branch
# Fix issue
# Deploy immediately
```

---

## My Recommendation

### 🎯 Suggested Flow:

1. **NOW: Local Testing** (30-60 min)
   - Create admin user in Supabase
   - Test login/logout
   - Test user management
   - Test role restrictions
   - Verify everything works

2. **THEN: Commit** (5 min)
   - Review changes one more time
   - Commit with good message
   - Push to feature branch

3. **THEN: Merge to Main** (5 min)
   - Create PR or merge locally
   - Push to main

4. **THEN: Vercel Setup** (15 min)
   - Add all environment variables
   - Update Instagram redirect URIs (if using)
   - Trigger deployment

5. **THEN: Production Migration** (10 min)
   - Run migrations in production
   - Create production admin user
   - Test login

6. **FINALLY: Production Testing** (30 min)
   - Full feature test in production
   - Create real users
   - Monitor for issues

**Total time: ~2-3 hours for complete deployment**

---

## What I Can Help With

I can help you with:
1. ✅ Testing locally (guide you through)
2. ✅ Creating SQL for first admin user
3. ✅ Git commit commands
4. ✅ Merge commands
5. ✅ Environment variable checklist
6. ✅ Troubleshooting any issues

**Ready to start with Phase 1 (Local Testing)?**

