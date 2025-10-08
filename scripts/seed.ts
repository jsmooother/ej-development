import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createDbClient } from "../src/lib/db";
import {
  enquiries,
  instagramCache,
  listingDocuments,
  listingImages,
  listings,
  posts,
  profiles,
  projectImages,
  projects,
  siteSettings,
} from "../src/lib/db/schema";

async function main() {
  const db = createDbClient();

  console.info("🔄 Resetting existing content…");

  await db.transaction(async (tx) => {
    await tx.delete(instagramCache);
    await tx.delete(enquiries);
    await tx.delete(listingImages);
    await tx.delete(listingDocuments);
    await tx.delete(projectImages);
    await tx.delete(posts);
    await tx.delete(projects);
    await tx.delete(listings);
    await tx.delete(siteSettings);
  });

  console.info("🌱 Seeding base settings…");
  const [settings] = await db
    .insert(siteSettings)
    .values({
      brandName: "EJ Development",
      primaryInstagramUsername: "ejdevelopment",
      contactEmail: "hello@ejdevelopment.com",
      contactPhone: "+34 600 123 456",
      address: "Marbella, Málaga, Spain",
      heroVideoUrl: "https://player.vimeo.com/video/10101010",
    })
    .returning();

  console.info("🏡 Seeding flagship listing…");
  const [villaListing] = await db
    .insert(listings)
    .values({
      slug: "casa-serrana",
      title: "Casa Serrana",
      subtitle: "Elevated Mediterranean living",
      description:
        "Casa Serrana is a 700 sqm villa sculpted to frame Marbella's light. A double-height great room opens to the terrace and infinity pool, while private suites on the upper levels overlook the Mediterranean.",
      facts: {
        bedrooms: 6,
        bathrooms: 7,
        builtAreaSqm: 700,
        plotSqm: 2100,
        parkingSpaces: 4,
        orientation: "South-west",
        amenities: ["Infinity pool", "Spa suite", "Cinema", "Wine gallery"],
      },
      location: {
        latitude: 36.5068,
        longitude: -4.8852,
        address: "Sierra Blanca, Marbella",
        locality: "Marbella",
        country: "Spain",
      },
      heroImagePath: "listing-images/casa-serrana/hero.jpg",
      status: "for_sale",
      brochurePdfPath: "documents/casa-serrana-brochure.pdf",
    })
    .returning();

  const listingImageData = [
    {
      listingId: villaListing.id,
      imagePath: "listing-images/casa-serrana/01-exterior.jpg",
      altText: "Casa Serrana exterior at dusk",
      sortOrder: 1,
    },
    {
      listingId: villaListing.id,
      imagePath: "listing-images/casa-serrana/02-living.jpg",
      altText: "Living room with view over the coast",
      sortOrder: 2,
    },
    {
      listingId: villaListing.id,
      imagePath: "listing-images/casa-serrana/03-master-suite.jpg",
      altText: "Master suite with private terrace",
      sortOrder: 3,
    },
    {
      listingId: villaListing.id,
      imagePath: "listing-images/casa-serrana/04-pool.jpg",
      altText: "Infinity pool overlooking Marbella",
      sortOrder: 4,
    },
    {
      listingId: villaListing.id,
      imagePath: "listing-images/casa-serrana/05-gallery.jpg",
      altText: "Atrium stair gallery bathed in light",
      sortOrder: 5,
    },
  ];

  await db.insert(listingImages).values(listingImageData);

  await db.insert(listingDocuments).values([
    {
      listingId: villaListing.id,
      label: "Main Residence Floorplan",
      documentPath: "documents/casa-serrana-floorplan.pdf",
      documentType: "floorplan",
      sortOrder: 1,
    },
  ]);

  console.info("🏗️ Seeding case study projects…");
  const [sierraProject] = await db
    .insert(projects)
    .values({
      slug: "sierra-horizon",
      title: "Sierra Horizon",
      summary: "Adaptive reuse of a hillside estate into a modern sanctuary.",
      content:
        "A complete reinvention of a 1980s villa, opening the floor plates and layering tactile materials. Sierra Horizon now flows effortlessly between shaded courtyards and panoramic terraces.",
      year: 2023,
      facts: {
        location: "La Zagaleta",
        sizeSqm: 1200,
        role: "Design & Development",
      },
      heroImagePath: "project-images/sierra-horizon/hero.jpg",
    })
    .returning();

  const [lomaProject] = await db
    .insert(projects)
    .values({
      slug: "loma-azul",
      title: "Loma Azul",
      summary: "Minimalist cliffside retreat capturing dawn-to-dusk light.",
      content:
        "Loma Azul stages the sky. The residence traces the cliff edge with low horizontal volumes, framing the sunrise over the Mediterranean while retreating into quiet internal patios by night.",
      year: 2022,
      facts: {
        location: "Benahavís",
        sizeSqm: 850,
        role: "Full Turnkey Delivery",
      },
      heroImagePath: "project-images/loma-azul/hero.jpg",
    })
    .returning();

  await db.insert(projectImages).values([
    {
      projectId: sierraProject.id,
      imagePath: "project-images/sierra-horizon/01-lounge.jpg",
      altText: "Sierra Horizon lounge with cedar ceiling",
      sortOrder: 1,
    },
    {
      projectId: sierraProject.id,
      imagePath: "project-images/sierra-horizon/02-courtyard.jpg",
      altText: "Internal courtyard with reflecting pool",
      sortOrder: 2,
    },
    {
      projectId: lomaProject.id,
      imagePath: "project-images/loma-azul/01-terrace.jpg",
      altText: "Loma Azul cliffside terrace at sunset",
      sortOrder: 1,
    },
    {
      projectId: lomaProject.id,
      imagePath: "project-images/loma-azul/02-spa.jpg",
      altText: "Spa pavilion carved into the hillside",
      sortOrder: 2,
    },
  ]);

  console.info("📝 Seeding editorial posts…");
  await db.insert(posts).values([
    {
      slug: "marbella-market-insights",
      title: "Marbella Market, Reframed",
      excerpt:
        "How design-led developments are reshaping the upper tier of the Costa del Sol property market.",
      content:
        "## Marbella Market, Reframed\n\nThe Costa del Sol continues to attract discerning buyers seeking both lifestyle and yield...",
      coverImagePath: "post-images/market-insights.jpg",
      tags: ["market", "insights"],
      publishedAt: new Date(),
    },
    {
      slug: "designing-with-light",
      title: "Designing with Andalusian Light",
      excerpt:
        "Our approach to glazing, shading, and thermal comfort in a climate that shifts from salt breezes to inland heat.",
      content:
        "## Designing with Andalusian Light\n\nLight is our primary material. From clerestory glazing to deep-set terraces...",
      coverImagePath: "post-images/designing-with-light.jpg",
      tags: ["design", "materials"],
      publishedAt: new Date(),
    },
    {
      slug: "neighbourhood-guide-marbella-golden-mile",
      title: "Neighbourhood Guide · Golden Mile",
      excerpt:
        "Where to dine, unwind, and gather within five minutes of our flagship villa.",
      content:
        "## Neighbourhood Guide · Golden Mile\n\nThe Golden Mile balances beach clubs with discreet private members' lounges...",
      coverImagePath: "post-images/golden-mile-guide.jpg",
      tags: ["guide", "lifestyle"],
      publishedAt: new Date(),
    },
  ]);

  console.info("👤 Preparing default admin profile (editor role)…");
  const defaultAdminUserId = randomUUID();
  await db.insert(profiles).values({
    userId: defaultAdminUserId,
    role: "admin",
  });

  console.info("✅ Seed complete");
  console.info(`   Site settings id: ${settings.id}`);
  console.info(`   Admin profile user id (link to Supabase Auth): ${defaultAdminUserId}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
