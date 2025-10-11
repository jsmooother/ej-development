# EJ Development · Marbella Flagship Villa Platform

This repository is the rebuilt foundation for EJ Development&apos;s luxury real-estate experience: a Next.js 14 + Supabase stack that will power the flagship Marbella villa listing, editorial journal, project case studies, local insights, and a secure admin workspace.

> **Status:** scaffolding in progress. Core tooling, database schema, route structure, and Supabase integration helpers are in place. UI, brochure generation, Instagram automation, and full admin workflows are up next.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript & Server Components
- **Styling:** Tailwind CSS 3.4, shadcn/ui ready, Framer Motion planned for micro-interactions
- **Data:** Supabase Postgres with Drizzle ORM (schema + migrations + seed script)
- **Auth & Storage:** Supabase Auth (email magic links) and Storage buckets (listings, projects, posts, documents)
- **Forms & Validation:** react-hook-form + zod (enquiry workflow planned)
- **SEO:** App Router metadata API, `sitemap.xml` & `robots.txt`, OG image generation pending
- **PDF:** `@react-pdf/renderer` for dynamic villa brochures (coming soon)
- **Tooling:** ESLint + Prettier, Tailwind config, `.nvmrc`, `@t3-oss/env-nextjs` for runtime env safety

## Getting Started

### 1. Prerequisites

- Node.js 20.18.0+ (`nvm use` reads `.nvmrc`)
- Supabase project (service role key + connection string)
- npm (or pnpm/yarn) for local development

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Duplicate `.env.example` → `.env.local` and populate:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_DB_POOL_URL=postgres://postgres:password@db.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
SUPABASE_DB_URL=postgres://postgres:password@db.supabase.co:5432/postgres # optional direct connection
DIRECT_URL=postgres://postgres:password@db.supabase.co:5432/postgres # optional, preferred for migrations/scripts
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Instagram Basic Display API (optional - see docs/INSTAGRAM_INTEGRATION.md)
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback
NEXT_PUBLIC_INSTAGRAM_APP_ID=

# Optional email & maps
RESEND_API_KEY=
MAPBOX_TOKEN=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

Runtime database connections prefer `SUPABASE_DB_POOL_URL` (Supabase → **Connection Pooling** tab). Keep `SUPABASE_DB_URL`/`DIRECT_URL` on hand for migrations, Drizzle Studio, and seed scripts so long-running transactions bypass PgBouncer.

### 4. Run Drizzle migrations

```bash
npm run db:generate   # generates SQL from schema definitions (already committed)
npm run db:push       # applies migrations to your Supabase database
```

The repo includes:

- `drizzle/0001_initial.sql` – schema (tables + enums)
- `drizzle/0002_policies.sql` – RLS & helper function for editor/admin access

### 5. Seed sample content (optional but recommended)

```bash
npm run seed
```

This seeds:

- Site settings (brand, contact, Instagram handle)
- Flagship listing (_Casa Serrana_) with images + floorplan document placeholder paths
- Two project case studies + galleries
- Three editorial posts
- Admin profile stub (printout shows the UUID to connect with Supabase Auth user)

### 6. Start developing

```bash
npm run dev
```

Visit http://localhost:3000. The single-page experience blends the flagship listing, projects, editorial previews, Instagram highlights, studio story, and contact touchpoints while detailed UI work continues.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Build production bundle |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js integration) |
| `npm run format` | Format repository with Prettier |
| `npm run db:generate` | Generate SQL migrations from Drizzle schema |
| `npm run db:push` | Push migrations to Supabase Postgres |
| `npm run db:studio` | Launch Drizzle Studio (needs DIRECT_URL or SUPABASE_DB_URL) |
| `npm run seed` | Seed content into Supabase |

## Directory Structure (current snapshot)

```
src/
├── app/
│   ├── (site)/                 # Public single-page experience (hero, listing, projects, journal, studio, contact)
│   ├── (admin)/admin           # Protected admin entry (placeholder)
│   ├── robots.ts               # SEO robots.txt config
│   └── sitemap.ts              # Declarative sitemap
├── components/
│   └── layout/                 # Header + footer scaffolding
├── lib/
│   ├── db/                     # Drizzle schema + helpers
│   ├── supabase/               # Server/browser client factories
│   ├── env.ts                  # Runtime env validation via @t3-oss/env-nextjs
│   └── utils.ts                # Tailwind-friendly `cn` helper
scripts/
└── seed.ts                     # Content seeding script
```

## Data Model Highlights

- `site_settings` – brand identity, contact channels, Instagram token references, Mapbox tokens
- `listings` + `listing_images` + `listing_documents` – villas, galleries, floorplans, brochure path
- `projects` + `project_images` – case studies with hero/fact metadata
- `posts` – editorial content with Markdown payload + tag array
- `enquiries` – unified enquiry submissions with JSON context metadata
- `instagram_cache` – cached Instagram posts from Basic Display API
- `instagram_settings` – OAuth tokens, sync settings, connection status
- `profiles` – Supabase Auth user roles (`admin`, `editor`)

Row-level security policies restrict write access to authenticated editors/admins while preserving public read access to published content. Enquiries remain publicly writable but only admin/editor roles can read them.

## Features

### ✅ Completed
- **Instagram Integration** – Full OAuth 2.0 flow, automatic post syncing, token refresh, admin management UI
- **Content Management** – Projects, editorials, listings, and Instagram posts with admin CRUD interfaces
- **Database & Auth** – Supabase Postgres with Drizzle ORM, row-level security, role-based access
- **Admin Dashboard** – Content overview, status management, hero project selection

### 🚧 Next Milestones

1. **Enhanced UI/UX** – Gallery lightbox, image optimization, motion animations
2. **Villa Brochures** – PDF generation with `@react-pdf/renderer`
3. **Contact Forms** – Enquiry workflow with email notifications via Resend
4. **SEO Enhancement** – OG image generation, structured data, analytics
5. **Scheduled Syncs** – Automatic Instagram sync via cron jobs

Contributions, questions, or deployment pairing? Ping the EJ Development team or open an issue.
