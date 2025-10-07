# Deployment Guide

Complete guide for deploying EJ Development website to production.

## Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

- [ ] Update admin credentials in `src/lib/auth.ts`
- [ ] Remove any test/dummy data from the database
- [ ] Test all admin functions locally
- [ ] Review and update content (About section, contact info, footer)
- [ ] Set up environment variables
- [ ] Choose a database solution for production
- [ ] Configure image hosting (if needed)
- [ ] Set up analytics (optional)
- [ ] Prepare custom domain (optional)

---

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the easiest way to deploy Next.js applications and is free for hobby projects.

#### Step-by-Step

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**
   In Vercel dashboard, go to Settings → Environment Variables:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```

4. **Redeploy**
   - Trigger a new deployment to apply environment variables

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

**Production URL:** `https://your-project.vercel.app`

---

### Option 2: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add admin credentials

4. **Deploy**

---

### Option 3: Railway

Perfect for databases and backend services.

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL (Optional)**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will provide connection string

4. **Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```

5. **Deploy**

---

### Option 4: Self-Hosted (VPS)

For full control using your own server.

#### Requirements
- Ubuntu 22.04 or similar
- Node.js 18+
- Nginx
- PM2
- SSL certificate (Let's Encrypt)

#### Setup Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd ej-development
   
   # Install dependencies
   npm install
   
   # Build for production
   npm run build
   
   # Start with PM2
   pm2 start npm --name "ej-development" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Install SSL Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Database Migration

### From JSON to PostgreSQL

1. **Install Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Define Schema** (`prisma/schema.prisma`)
   ```prisma
   model BlogPost {
     id        String   @id @default(cuid())
     category  String
     title     String
     excerpt   String
     content   String?
     image     String
     published Boolean  @default(true)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   
   model Property {
     id          String   @id @default(cuid())
     size        String
     rooms       String
     image       String
     location    String?
     price       String?
     description String?
     published   Boolean  @default(true)
     createdAt   DateTime @default(now())
   }
   
   model InstagramPost {
     id        String   @id @default(cuid())
     caption   String
     image     String
     url       String
     createdAt DateTime @default(now())
   }
   ```

3. **Migrate Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Update `src/lib/db.ts`**
   ```typescript
   import { PrismaClient } from '@prisma/client';
   
   const prisma = new PrismaClient();
   
   export async function getBlogPosts() {
     return await prisma.blogPost.findMany();
   }
   
   // Update other functions...
   ```

---

## Environment Variables

### Development (`.env.local`)
```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/ejdev

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production
```env
# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_very_secure_password

# Database
DATABASE_URL=postgresql://...

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Image Upload
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Security Hardening

### 1. Update Authentication

Replace simple auth with NextAuth.js:

```bash
npm install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === process.env.ADMIN_USERNAME &&
            credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ]
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 2. Add Rate Limiting

```bash
npm install rate-limiter-flexible
```

### 3. Input Validation

```bash
npm install zod
```

```typescript
import { z } from 'zod';

const BlogPostSchema = z.object({
  category: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().optional(),
  image: z.string().url(),
  published: z.boolean()
});
```

### 4. Security Headers

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};
```

---

## Performance Optimization

### 1. Image Optimization

Use Next.js Image component (already implemented) and consider:
- Upload images to CDN (Cloudinary, Uploadcare)
- Compress images before upload
- Use WebP format

### 2. Caching

Add `revalidate` to data fetching:

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### 3. Bundle Analysis

```bash
npm install @next/bundle-analyzer
```

---

## Monitoring & Analytics

### Google Analytics

1. Create GA4 property
2. Add tracking ID to environment variables
3. Install package:
   ```bash
   npm install @next/third-parties
   ```

### Error Tracking

Consider adding [Sentry](https://sentry.io):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Backup Strategy

### 1. Database Backups

If using PostgreSQL on Vercel:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### 2. Code Backups

Always push to GitHub:
```bash
git push origin main
```

### 3. Automated Backups

Set up cron job:
```bash
0 2 * * * cd /path/to/project && pg_dump ... > backups/db-$(date +\%Y\%m\%d).sql
```

---

## Post-Deployment Testing

- [ ] Visit homepage and verify content loads
- [ ] Test admin login
- [ ] Create a test blog post
- [ ] Upload a test property
- [ ] Verify mobile responsiveness
- [ ] Test all navigation links
- [ ] Check Instagram feed
- [ ] Test contact form (if functional)
- [ ] Verify SSL certificate
- [ ] Check page load speed (aim for < 3s)

---

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

Check:
1. DATABASE_URL is correct
2. Database is accessible from deployment server
3. Firewall rules allow connection

### 404 Errors

Ensure `.next` directory is included in deployment.

---

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Git
```bash
git revert HEAD
git push origin main
```

---

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Community: [GitHub Discussions](https://github.com/vercel/next.js/discussions)

