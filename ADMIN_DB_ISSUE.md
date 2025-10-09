# Admin Dashboard Database Issue

## Problem
The admin dashboard at `/admin` is timing out when trying to load. The database queries are taking too long.

## Current Status
- **Database:** ✅ Connected and seeded with 3 projects and 3 editorials
- **Public Site:** ❌ Still using hardcoded mock data (not pulling from DB)
- **Admin Dashboard:** ❌ Timing out on database queries

## Quick Fix Options

### Option 1: Make Admin Static (Recommended for Development)
Since we don't have auth yet, we can make the admin pages static to load instantly:
```typescript
export const dynamic = "force-static";
export const revalidate = 60; // Refresh every minute
```

### Option 2: Optimize Database Connection
The connection might be timing out. Check:
1. Is `SUPABASE_DB_URL` correct in `.env`?
2. Is the database accessible from localhost?
3. Try increasing timeouts in `src/lib/db/index.ts`

### Option 3: Skip Database for Now
Keep mock data in admin until we're ready to connect everything.

## Next Steps
1. **For now:** Continue building admin UI with mock data
2. **Later:** Connect public site to database
3. **Final:** Add authentication and full database integration

The important thing is the database IS working (we successfully seeded it), just the connection is slow for development.

