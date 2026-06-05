# Supabase Environment Variables Guide

Complete guide for adding all Supabase-related environment variables to your project.

---

## Quick Reference

| Variable | Where to find it | Required |
|----------|------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role | Yes (admin) |
| `SUPABASE_DB_POOL_URL` | Project Settings → Database → Connection string (Pooler) | Yes |
| `SUPABASE_DB_URL` | Project Settings → Database → Connection string (Direct) | Optional |
| `DIRECT_URL` | Same as SUPABASE_DB_URL | Optional (migrations) |

---

## Step-by-Step: Supabase Dashboard

### 1. Open your Supabase project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) and select your project.

### 2. Get API credentials

1. Click **Project Settings** (gear icon in sidebar)
2. Go to **API** in the left menu
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (under Project API keys) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Never expose `service_role` in client-side code.** It bypasses Row Level Security. Use only in server-side API routes and scripts.

### 3. Get database connection strings

1. In **Project Settings**, go to **Database**
2. Scroll to **Connection string**
3. Choose **URI** tab
4. Copy:
   - **Connection pooling** (port 6543, Transaction mode) → `SUPABASE_DB_POOL_URL`
   - **Direct connection** (port 5432) → `SUPABASE_DB_URL` or `DIRECT_URL`

**Connection pooling** format:
```
postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Direct connection** format:
```
postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with your database password (from **Database** → **Database password** if you forgot it).

---

## Local setup: `.env.local`

Create or edit `.env.local` in the project root:

```env
# Supabase – required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database – use pool URL for app, direct for migrations
SUPABASE_DB_POOL_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
SUPABASE_DB_URL=postgres://postgres:[password]@db.[ref].supabase.co:5432/postgres
DIRECT_URL=postgres://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Investor portal (optional)
INVESTOR_PASSWORD=your-secret-password
```

Restart the dev server after changing env vars.

---

## Vercel setup

1. Go to your project on [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key | Production, Preview, Development |
| `SUPABASE_DB_POOL_URL` | Pool connection string | Production, Preview, Development |
| `SUPABASE_DB_URL` | Direct connection string | Production, Preview (optional) |
| `DIRECT_URL` | Same as SUPABASE_DB_URL | Production, Preview (for migrations) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.ejproperties.es` | Production |
| `INVESTOR_PASSWORD` | Your investor gate password | Production, Preview |

4. **Save** – Vercel will trigger a new deployment.

---

## What each variable does

| Variable | Used for |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API base URL (client + server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for auth, RLS, and safe client access |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations: user management, storage, bypass RLS |
| `SUPABASE_DB_POOL_URL` | Drizzle ORM runtime queries (PgBouncer) |
| `SUPABASE_DB_URL` | Direct Postgres when pooling is not suitable |
| `DIRECT_URL` | Migrations, Drizzle Studio, seed scripts |

---

## Verify setup

After adding variables:

1. **Local:** `npm run dev` and visit `/api/test-db` – it reports which vars are set
2. **Vercel:** Deploy and check the build logs; the app should start without Supabase errors

---

## Preventing Supabase pause (free tier)

Supabase pauses free projects after **7 days of inactivity**. This repo includes a keep-alive setup:

1. **GitHub Actions (primary)** – `.github/workflows/keep-supabase-alive.yml` pings the Supabase REST API directly twice weekly (Sunday and Wednesday). This does **not** depend on the Vercel app or direct Postgres connection strings.
2. **`/api/keep-alive`** – Site endpoint that tries a DB query and a Supabase REST read; used as a secondary health check.

**Setup:** In GitHub → repo **Settings** → **Secrets and variables** → **Actions**, add **Secrets** (required):

| Secret | Value |
|--------|--------|
| `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable (or legacy anon) key from Supabase → Settings → API |

Optional **Variables**:

| Variable | Value |
|----------|--------|
| `DEPLOYMENT_URL` | `https://www.ejproperties.es` (for secondary site ping; defaults to this URL) |

**If the project is paused:** open the [Supabase dashboard](https://supabase.com/dashboard), select the project, and click **Restore**. DNS and database access return within a few minutes. Then verify `/api/test-db` on production returns all green checks.

**Alternative:** Use [cron-job.org](https://cron-job.org) (free) to hit your Supabase REST URL every few days:

`GET https://YOUR_PROJECT.supabase.co/rest/v1/site_settings?select=id&limit=1`  
Headers: `apikey` and `Authorization: Bearer YOUR_PUBLISHABLE_KEY`

---

## Optional variables (non-Supabase)

| Variable | Purpose |
|----------|---------|
| `INSTAGRAM_APP_ID` | Instagram Basic Display API |
| `INSTAGRAM_APP_SECRET` | Instagram OAuth |
| `INSTAGRAM_REDIRECT_URI` | OAuth callback URL |
| `NEXT_PUBLIC_INSTAGRAM_APP_ID` | Client-side Instagram init |
| `RESEND_API_KEY` | Email (e.g. enquiry notifications) |
| `MAPBOX_TOKEN` | Maps (if used) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Client-side maps |
