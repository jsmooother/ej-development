import * as dotenv from "dotenv";
import postgres from "postgres";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error("❌ SUPABASE_DB_URL is not set in .env");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Seeding database with mock data...\n");

  const sql = postgres(dbUrl, { ssl: "require", max: 1 });

  try {
    // Mock Projects
    const mockProjects = [
      {
        slug: "sierra-horizon",
        title: "Sierra Horizon",
        summary: "La Zagaleta · 2023 - Adaptive reuse opening a hillside estate toward the sea with layered courtyards.",
        content: "Adaptive reuse opening a hillside estate toward the sea with layered courtyards.",
        year: 2023,
        facts: JSON.stringify({ sqm: 420, bedrooms: 6, bathrooms: 5 }),
        hero_image_path: "https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80",
        is_published: true,
        published_at: "2023-06-15",
      },
      {
        slug: "loma-azul",
        title: "Loma Azul",
        summary: "Benahavís · 2022 - Minimalist cliffside retreat capturing Andalusian light from sunrise to dusk.",
        content: "Minimalist cliffside retreat capturing Andalusian light from sunrise to dusk.",
        year: 2022,
        facts: JSON.stringify({ sqm: 380, bedrooms: 5, bathrooms: 4 }),
        hero_image_path: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        is_published: true,
        published_at: "2022-09-20",
      },
      {
        slug: "casa-palma",
        title: "Casa Palma",
        summary: "Marbella Club · 2021 - Palm-framed sanctuary with shaded loggias and a terraced pool axis.",
        content: "Palm-framed sanctuary with shaded loggias and a terraced pool axis.",
        year: 2021,
        facts: JSON.stringify({ sqm: 320, bedrooms: 4, bathrooms: 3 }),
        hero_image_path: "https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80",
        is_published: true,
        published_at: "2021-05-10",
      },
    ];

    console.log("📦 Inserting projects...");
    for (const p of mockProjects) {
      await sql`
        INSERT INTO projects (slug, title, summary, content, year, facts, hero_image_path, is_published, published_at)
        VALUES (${p.slug}, ${p.title}, ${p.summary}, ${p.content}, ${p.year}, ${p.facts}::jsonb, ${p.hero_image_path}, ${p.is_published}, ${p.published_at})
        ON CONFLICT (slug) DO NOTHING
      `;
      console.log(`   ✓ Added: ${p.title}`);
    }

    // Mock Posts/Editorials
    const mockPosts = [
      {
        slug: "marbella-market-reframed",
        title: "Marbella Market, Reframed",
        excerpt: "Design-led developments are resetting expectations along the Golden Mile.",
        content: "The Marbella property market is experiencing a renaissance...",
        tags: ["Market Insight"],
        cover_image_path: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
        is_published: true,
        published_at: "2025-10-01",
      },
      {
        slug: "andalusian-light",
        title: "Designing with Andalusian Light",
        excerpt: "Glazing, shading, and thermal comfort principles for coastal villas.",
        content: "The quality of light in southern Spain is legendary...",
        tags: ["Design Journal"],
        cover_image_path: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        is_published: true,
        published_at: "2025-09-15",
      },
      {
        slug: "golden-mile-guide",
        title: "Neighbourhood Guide · Golden Mile",
        excerpt: "Our curated shortlist of dining, wellness, and cultural highlights.",
        content: "The Golden Mile represents Marbella at its most refined...",
        tags: ["Guide"],
        cover_image_path: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        is_published: true,
        published_at: "2025-08-20",
      },
    ];

    console.log("\n📝 Inserting editorials...");
    for (const p of mockPosts) {
      await sql`
        INSERT INTO posts (slug, title, excerpt, content, tags, cover_image_path, is_published, published_at)
        VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.content}, ${p.tags}, ${p.cover_image_path}, ${p.is_published}, ${p.published_at})
        ON CONFLICT (slug) DO NOTHING
      `;
      console.log(`   ✓ Added: ${p.title}`);
    }

    console.log("\n✅ Seeding completed successfully!");
    console.log(`\nVisit http://localhost:3000/admin to manage this content.\n`);

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();

