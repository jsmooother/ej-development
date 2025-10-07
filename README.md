# EJ Development - Costa del Sol Property Development Website

A modern, elegant property development website inspired by Lagerlings.se, featuring a complete content management system (CMS) for managing blog posts, property listings, and Instagram feeds.

![EJ Development](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)

## 🌟 Features

### Frontend
- **Elegant Design**: Clean, light aesthetic inspired by Lagerlings.se
- **Animated Header**: Smooth letter-by-letter wordmark animation with scroll effects
- **Magazine Layout**: Masonry grid mixing blog posts and property listings
- **About Section**: Company introduction with elegant typography
- **Instagram Feed**: Grid display of latest Instagram posts
- **Responsive Design**: Mobile-first approach with smooth transitions
- **Dynamic Content**: All content fetched from database

### Backend & Admin
- **Full CMS Dashboard**: Manage all content from a single interface
- **Blog Management**: Create, edit, delete blog posts with categories
- **Property Listings**: Manage property details, images, and descriptions
- **Instagram Integration**: Add/remove Instagram feed posts
- **Authentication**: Simple admin login system
- **REST API**: Full CRUD operations for all content types
- **File-based Database**: JSON storage (easily migrate to PostgreSQL/MongoDB)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ej-development
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

### Default Admin Credentials
```
Username: admin
Password: admin123
```

⚠️ **Important**: Change these credentials in `src/lib/auth.ts` before deploying to production!

## 📁 Project Structure

```
ej-development/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── page.tsx        # Login page
│   │   │   ├── dashboard/      # Main admin dashboard
│   │   │   ├── blog-posts/     # Blog post management
│   │   │   ├── properties/     # Property management
│   │   │   └── instagram/      # Instagram feed management
│   │   ├── api/                # REST API routes
│   │   │   ├── blog-posts/     # Blog posts CRUD
│   │   │   ├── properties/     # Properties CRUD
│   │   │   └── instagram/      # Instagram posts CRUD
│   │   ├── globals.css         # Global styles & animations
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── AnimatedWordmark.tsx  # Animated header text
│   │   └── SiteHeader.tsx        # Main navigation header
│   └── lib/
│       ├── auth.ts             # Authentication logic
│       └── db.ts               # Database operations
├── data/                       # JSON database files (auto-created)
│   ├── blog-posts.json
│   ├── properties.json
│   └── instagram-posts.json
├── public/                     # Static assets
└── package.json
```

## 🎨 Design System

### Colors
- **Background**: `#fafafa` (light gray)
- **Foreground**: `#1a1a1a` (near black)
- **Accent**: `#c4a676` (gold/tan)
- **Borders**: `rgba(0, 0, 0, 0.1)` (subtle black)

### Typography
- **Font**: Geist Sans (var font)
- **Headings**: Light weight (300-400)
- **Body**: Regular weight (400)
- **Letter Spacing**: Wide tracking for headings (0.15em - 0.3em)

### Animations
- **Wordmark Reveal**: Staggered letter animation on load
- **Header Shrink**: Subtle size reduction on scroll
- **Image Hover**: Scale + overlay effects
- **Transitions**: Smooth 300-500ms cubic-bezier easing

## 🔧 Admin Dashboard Usage

### Accessing the Dashboard
1. Navigate to `/admin`
2. Login with admin credentials
3. Select a content type to manage

### Managing Blog Posts
1. Go to **Blog Posts** section
2. Click **"New Post"**
3. Fill in:
   - Category (e.g., DESIGN, LIFESTYLE)
   - Title
   - Excerpt
   - Content (optional)
   - Image URL
   - Published status
4. Click **"Create"** or **"Update"**

### Managing Properties
1. Go to **Properties** section
2. Click **"New Property"**
3. Fill in:
   - Size (e.g., "246 m²")
   - Rooms (e.g., "5 rum")
   - Image URL
   - Location (optional)
   - Price (optional)
   - Description (optional)
   - Published status
4. Click **"Create"** or **"Update"**

### Managing Instagram Posts
1. Go to **Instagram** section
2. Click **"New Post"**
3. Fill in:
   - Image URL
   - Instagram post URL
   - Caption
4. Click **"Create"**

## 🔌 API Documentation

All API endpoints return JSON and support standard REST methods.

### Blog Posts

#### Get all blog posts
```
GET /api/blog-posts
```

#### Get single blog post
```
GET /api/blog-posts/[id]
```

#### Create blog post
```
POST /api/blog-posts
Content-Type: application/json

{
  "category": "DESIGN",
  "title": "Post Title",
  "excerpt": "Brief description",
  "content": "Full content (optional)",
  "image": "https://...",
  "published": true
}
```

#### Update blog post
```
PUT /api/blog-posts/[id]
Content-Type: application/json

{
  "title": "Updated Title",
  ...
}
```

#### Delete blog post
```
DELETE /api/blog-posts/[id]
```

### Properties

#### Get all properties
```
GET /api/properties
```

#### Create property
```
POST /api/properties
Content-Type: application/json

{
  "size": "246 m²",
  "rooms": "5 rum",
  "image": "https://...",
  "location": "Marbella",
  "price": "€2.5M",
  "description": "...",
  "published": true
}
```

Similar endpoints exist for `/api/properties/[id]` (GET, PUT, DELETE)

### Instagram Posts

```
GET /api/instagram
POST /api/instagram
DELETE /api/instagram/[id]
```

## 🔐 Security Considerations

### Before Deploying to Production:

1. **Change Admin Credentials**
   - Update `src/lib/auth.ts`
   - Use environment variables
   - Consider implementing NextAuth.js

2. **Add Rate Limiting**
   - Protect API endpoints
   - Implement request throttling

3. **Secure Database**
   - Migrate from JSON files to proper database
   - Add input validation
   - Sanitize user inputs

4. **Environment Variables**
   - Create `.env.local` for secrets
   - Never commit credentials to git

5. **HTTPS**
   - Ensure SSL/TLS in production
   - Use secure headers

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically
4. Configure environment variables

### Other Platforms
- **Netlify**: Supports Next.js
- **Railway**: Easy deployment
- **Self-hosted**: Use Docker + PM2

### Post-Deployment Checklist
- [ ] Update admin credentials
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Add analytics (optional)
- [ ] Test all admin functions
- [ ] Backup database regularly

## 📦 Database Migration

The current JSON file storage is great for development but should be migrated for production:

### PostgreSQL (Recommended)
```bash
npm install @vercel/postgres
```

### MongoDB
```bash
npm install mongodb
```

### Prisma (ORM)
```bash
npm install prisma @prisma/client
```

Update `src/lib/db.ts` with your chosen database adapter.

## 🎯 Customization

### Changing Colors
Edit `src/app/globals.css`:
```css
:root {
  --background: #fafafa;
  --foreground: #1a1a1a;
  --accent: #c4a676;
}
```

### Updating Company Info
Edit footer in `src/app/page.tsx`:
```tsx
<address>
  <p>Your Address</p>
  <p>Your City</p>
</address>
```

### Adding New Content Types
1. Add interface in `src/lib/db.ts`
2. Create CRUD functions
3. Add API routes in `src/app/api/`
4. Create admin page in `src/app/admin/`

## 📄 License

[Your License Here]

## 👨‍💻 Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Tech Stack
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript 5.x
- **Database**: JSON files (development)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Not Found
The `/data` directory is auto-created. If missing:
```bash
mkdir data
```

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: [your-email]

## 🙏 Credits

- Design inspiration: [Lagerlings.se](https://lagerlings.se)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

Made with ❤️ for Costa del Sol property development
