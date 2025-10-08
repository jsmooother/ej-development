# EJ Development · Marbella Flagship Villa Platform

This repository is the rebuilt foundation for EJ Development&apos;s luxury real-estate experience: a Next.js 14 + Supabase stack that will power the flagship Marbella villa listing, editorial journal, project case studies, local insights, and a secure admin workspace.

> **Status:** core stack online. Drizzle schema + migrations, Supabase helpers, admin dashboards (listings, projects, posts, enquiries, settings), and database health diagnostics are in place. Brochure generation, Instagram automation, and richer public UI come next.

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

Duplicate `.env.example` → `.env.local` and populate. Use `SUPABASE_DB_URL` for the PgBouncer connection string and `DIRECT_URL` (optional) for direct connections during migrations:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_DB_URL=postgres://USER:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgres://USER:PASSWORD@db.supabase.co:5432/postgres # optional but recommended for migrations
NEXT_PUBLIC_SITE_URL=http://localhost:3000
INSTAGRAM_ACCESS_TOKEN= # optional seed value, final token is edited in the admin
RESEND_API_KEY=
MAPBOX_TOKEN=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

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

The seed script now disposes of its dedicated database connection when finished to avoid idle Supabase sessions.

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
| `npm run db:studio` | Launch Drizzle Studio (needs SUPABASE_DB_URL) |
| `npm run seed` | Seed content into Supabase |

## Directory Structure (current snapshot)

```
src/
├── app/
│   ├── (site)/                 # Public single-page experience (hero, listing, projects, journal, studio, contact)
│   ├── (admin)/admin           # Admin workspace (dashboard, listings, projects, posts, enquiries, settings, Instagram)
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
- `instagram_cache` – cached Basic Display API payloads for graceful fallback
- `profiles` – Supabase Auth user roles (`admin`, `editor`)

Row-level security policies restrict write access to authenticated editors/admins while preserving public read access to published content. Enquiries remain publicly writable but only admin/editor roles can read them.

### Database connection health

- The admin dashboard includes a **Database Status** card that pings Supabase via Drizzle (`SELECT 1`) and surfaces latency, pooling mode (PgBouncer vs direct), SSL status, and helpful error codes when misconfigured.
- Use this view after deploying or rotating credentials to confirm the application can read/write before editors begin publishing content.
- Environment helpers in `src/lib/db/index.ts` automatically opt-out of SSL for localhost connections while requiring it for hosted Supabase projects.

## Next Milestones

1. **Design System & UI Build** – shadcn/ui primitives, typographic scale, hero layouts, galleries, and motion.
2. **Villa Experience** – Supabase data fetchers, gallery lightbox, facts grid, brochure PDF generation, enquiry form.
3. **Projects & Journal** – dynamic data hydration within the blended homepage, MDX rendering, related content modules.
4. **Admin Workspace Enhancements** – Auth gating, detail views, media uploads, PDF triggers layered onto the new dashboards.
5. **Instagram Automation** – API route caching, admin override, and graceful front-end fallbacks.

Contributions, questions, or deployment pairing? Ping the EJ Development team or open an issue.
