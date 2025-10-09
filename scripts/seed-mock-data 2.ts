import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Set required env vars for the script context
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env");
  process.exit(1);
}

import { getDb, projects, posts } from "@/lib/db";

async function seedMockData() {
  console.log("🌱 Seeding database with mock data...\n");

  const db = getDb();

  try {
    // Mock Projects (from homepage)
    const mockProjects = [
      {
        slug: "sierra-horizon",
        title: "Sierra Horizon",
        subtitle: "La Zagaleta · 2023",
        description: "Adaptive reuse opening a hillside estate toward the sea with layered courtyards. This project represents a careful balance between modern interventions and respect for the existing architectural language.",
        facts: {
          sqm: 420,
          bedrooms: 6,
          bathrooms: 5,
          plotSqm: 1200,
          parkingSpaces: 3,
          orientation: "South",
          amenities: ["Infinity Pool", "Home Gym", "Wine Cellar", "Cinema Room"],
        },
        location: {
          locality: "La Zagaleta",
          address: "Sierra Blanca",
          country: "Spain",
          latitude: 36.5270,
          longitude: -4.9324,
        },
        heroImagePath: "https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80",
        isPublished: true,
        publishedAt: new Date("2023-06-15"),
      },
      {
        slug: "loma-azul",
        title: "Loma Azul",
        subtitle: "Benahavís · 2022",
        description: "Minimalist cliffside retreat capturing Andalusian light from sunrise to dusk. Clean lines and expansive glazing create a seamless connection with the Mediterranean landscape.",
        facts: {
          sqm: 380,
          bedrooms: 5,
          bathrooms: 4,
          plotSqm: 900,
          parkingSpaces: 2,
          orientation: "Southeast",
          amenities: ["Infinity Pool", "Spa", "Guest House", "Outdoor Kitchen"],
        },
        location: {
          locality: "Benahavís",
          country: "Spain",
          latitude: 36.5431,
          longitude: -5.0375,
        },
        heroImagePath: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        isPublished: true,
        publishedAt: new Date("2022-09-20"),
      },
      {
        slug: "casa-palma",
        title: "Casa Palma",
        subtitle: "Marbella Club · 2021",
        description: "Palm-framed sanctuary with shaded loggias and a terraced pool axis. Traditional Andalusian courtyard design meets contemporary living standards.",
        facts: {
          sqm: 320,
          bedrooms: 4,
          bathrooms: 3,
          plotSqm: 750,
          parkingSpaces: 2,
          orientation: "South",
          amenities: ["Pool", "Courtyard Garden", "Roof Terrace", "BBQ Area"],
        },
        location: {
          locality: "Marbella Club",
          country: "Spain",
          latitude: 36.5108,
          longitude: -4.8824,
        },
        heroImagePath: "https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80",
        isPublished: true,
        publishedAt: new Date("2021-05-10"),
      },
      {
        slug: "mirador-alto",
        title: "Mirador Alto",
        subtitle: "Puerto Banús · 2020",
        description: "Art-filled penthouse reimagined with sculptural joinery and panoramic glazing. A sophisticated urban retreat with stunning coastal views.",
        facts: {
          sqm: 280,
          bedrooms: 3,
          bathrooms: 3,
          parkingSpaces: 2,
          orientation: "Southwest",
          amenities: ["Panoramic Views", "Private Terrace", "Concierge", "Gym Access"],
        },
        location: {
          locality: "Puerto Banús",
          country: "Spain",
          latitude: 36.4844,
          longitude: -4.9531,
        },
        heroImagePath: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80",
        isPublished: true,
        publishedAt: new Date("2020-11-15"),
      },
      {
        slug: "villa-ladera",
        title: "Villa Ladera",
        subtitle: "Nueva Andalucía · 2019",
        description: "Split-level home cantilevered over native landscaping and a reflecting pool. Innovative architecture that maximizes views and natural light.",
        facts: {
          sqm: 450,
          bedrooms: 7,
          bathrooms: 6,
          plotSqm: 1500,
          parkingSpaces: 4,
          orientation: "South",
          amenities: ["Infinity Pool", "Home Theater", "Wine Cellar", "Sauna", "Guest Apartment"],
        },
        location: {
          locality: "Nueva Andalucía",
          country: "Spain",
          latitude: 36.4975,
          longitude: -4.9669,
        },
        heroImagePath: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80",
        isPublished: true,
        publishedAt: new Date("2019-08-25"),
      },
    ];

    console.log("📦 Inserting projects...");
    for (const project of mockProjects) {
      await db.insert(projects).values(project);
      console.log(`   ✓ Added: ${project.title}`);
    }

    // Mock Editorials/Posts (from homepage)
    const mockPosts = [
      {
        slug: "marbella-market-reframed",
        title: "Marbella Market, Reframed",
        excerpt: "Design-led developments are resetting expectations along the Golden Mile, creating a new paradigm for luxury coastal living.",
        content: `The Marbella property market is experiencing a renaissance. No longer satisfied with generic luxury, discerning buyers are seeking homes that tell a story, that integrate thoughtfully with their surroundings, and that prioritize quality of life over mere square footage.

This shift represents a fundamental change in how we think about luxury real estate on the Costa del Sol. The new benchmark isn't just about amenities—it's about architectural integrity, sustainable materials, and spaces that enhance daily living.

Recent developments along the Golden Mile exemplify this trend: clean lines replacing ornate excess, natural materials chosen for their longevity and beauty, and layouts that prioritize flow and light over formal rooms that go unused.`,
        category: "Market Insight",
        heroImagePath: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        publishedAt: new Date("2025-10-01"),
      },
      {
        slug: "andalusian-light",
        title: "Designing with Andalusian Light",
        excerpt: "Glazing, shading, and thermal comfort principles for coastal villas that embrace the Mediterranean climate.",
        content: `The quality of light in southern Spain is legendary—and deserves to be treated with respect in architectural design. Understanding how to harness this light while maintaining thermal comfort is essential for creating livable spaces along the coast.

Our approach involves careful consideration of orientation, strategic placement of glazing, and the integration of traditional shading techniques adapted for contemporary living. Deep overhangs, retractable louvers, and planted terraces all play a role in creating comfortable interiors that maintain visual connection with the landscape.

The goal is spaces that feel bright and open without becoming greenhouses—a balance that requires both technical knowledge and sensitivity to the specific qualities of Mediterranean light throughout the day and across seasons.`,
        category: "Design Journal",
        heroImagePath: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        publishedAt: new Date("2025-09-15"),
      },
      {
        slug: "golden-mile-guide",
        title: "Neighbourhood Guide · Golden Mile",
        excerpt: "Our curated shortlist of dining, wellness, and cultural highlights near Casa Serrana and our other developments.",
        content: `The Golden Mile represents Marbella at its most refined. Beyond the luxury hotels and beach clubs lies a network of carefully curated experiences that define the area's character.

For morning coffee, we recommend the terrace at Café del Mar. Evenings call for the seasonal menu at Skina (two Michelin stars) or the more relaxed atmosphere of Casanis Bistrot. The weekly market at Puerto Banús offers exceptional produce and a glimpse into local life.

Wellness options abound: the spa at Puente Romano, yoga sessions at Mantra, or simply walking the coastal path that connects the neighborhood's beaches. This is living well, Costa del Sol style.`,
        category: "Guide",
        heroImagePath: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        publishedAt: new Date("2025-08-20"),
      },
      {
        slug: "inside-the-atelier",
        title: "Inside the Atelier",
        excerpt: "Material stories and artisan collaborations from our Marbella workshop, where tradition meets innovation.",
        content: `Our Marbella atelier serves as both design studio and material library—a space where we can test finishes, prototype details, and work directly with the craftspeople who bring our projects to life.

The relationship between designer and maker is central to our process. Whether it's the cabinetmaker who's been perfecting joinery for thirty years or the stone mason who sources from family quarries in Granada, these collaborations ensure that every detail meets our standards.

Recent projects have seen us working with reclaimed terracotta for flooring, commissioning custom bronze hardware, and developing new applications for traditional lime plaster. The results speak to both heritage and innovation.`,
        category: "Studio",
        heroImagePath: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        publishedAt: new Date("2025-07-10"),
      },
      {
        slug: "sustainable-stone",
        title: "Sourcing Sustainable Stone",
        excerpt: "Tracing quarry provenance for each terrazzo slab and limestone block, ensuring ethical and aesthetic excellence.",
        content: `Every stone we specify has a story. Where was it quarried? Under what conditions? How far did it travel? These questions matter—both for environmental impact and for the integrity of our work.

We've developed relationships with quarries throughout Spain that meet our standards for both quality and sustainability. The limestone we used in Sierra Horizon came from a family-run quarry in Valencia that's been operating responsibly for generations. The terrazzo in Loma Azul incorporates recycled marble from a renovation in Málaga.

This attention to provenance doesn't just reduce environmental impact—it also ensures we're working with materials that have genuine character and will age beautifully over time.`,
        category: "Process",
        heroImagePath: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        publishedAt: new Date("2025-06-25"),
      },
    ];

    console.log("\n📝 Inserting editorials...");
    for (const post of mockPosts) {
      await db.insert(posts).values(post);
      console.log(`   ✓ Added: ${post.title}`);
    }

    console.log("\n✅ Seeding completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - ${mockProjects.length} projects added`);
    console.log(`   - ${mockPosts.length} editorials added`);
    console.log(`\nYou can now visit http://localhost:3000/admin to manage this content.\n`);

  } catch (error) {
    console.error("\n❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

seedMockData();

