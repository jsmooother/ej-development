# Deploy & Connect Domain

## 1. Deploy to Vercel

### Option A: Via GitHub (if project is linked)

```bash
git add .
git commit -m "Supabase migration, keep-alive, connection scripts"
git push origin main
```

Vercel will auto-deploy when you push to `main`.

### Option B: Via Vercel CLI

```bash
vercel login    # if not logged in
vercel deploy --prod -y
```

### Verify env vars in Vercel

Project → **Settings** → **Environment Variables** (Production + Preview):

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ |
| `SUPABASE_DB_POOL_URL` | ✓ |
| `SUPABASE_DB_URL` | ✓ |
| `DIRECT_URL` | ✓ |
| `NEXT_PUBLIC_SITE_URL` | ✓ (set to `https://www.ejdevelopment.es` for prod) |

---

## 2. Connect Custom Domain (ejdevelopment.es)

### In Vercel

1. Project → **Settings** → **Domains**
2. Add domain: `www.ejdevelopment.es` (and optionally `ejdevelopment.es` for root)
3. Vercel will show the DNS records to add

### In one.com (or your DNS provider)

Add these records:

| Type | Name | Value |
|------|------|-------|
| **CNAME** | `www` | `cname.vercel-dns.com` |

For root domain (`ejdevelopment.es`):

| Type | Name | Value |
|------|------|-------|
| **A** | `@` | `76.76.21.21` |

Or use Vercel nameservers if your provider supports it (simplest).

### Verify

- DNS can take 5–60 minutes to propagate
- Vercel will auto-provision SSL
- Check status in Vercel → Domains

---

## 3. Update site URL

After domain is live, set in Vercel env vars:

```
NEXT_PUBLIC_SITE_URL=https://www.ejdevelopment.es
```

Then redeploy.
