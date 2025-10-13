import "dotenv/config";
import { createDbClient } from "../src/lib/db/index";
import { projects } from "../src/lib/db/schema";
import { eq } from 'drizzle-orm';

// Sample project data - you can replace this with your actual project data
const sampleProjects = [
  {
    title: "Modern Villa Renovation",
    slug: "modern-villa-renovation",
    summary: "Complete transformation of a 1970s villa into a contemporary family home",
    content: `This stunning renovation project transformed a dated 1970s villa into a contemporary family home that perfectly balances modern aesthetics with functional living.

The transformation began with a complete structural overhaul, opening up the ground floor to create a seamless flow between the kitchen, dining, and living areas. Large sliding glass doors now connect the interior with the beautifully landscaped garden, bringing natural light deep into the home.

The kitchen features custom Italian cabinetry with integrated appliances and a large central island that serves as both a cooking station and social hub. The master suite was completely redesigned with a walk-in wardrobe and en-suite bathroom featuring a freestanding bathtub and rain shower.

Sustainable materials were used throughout, including reclaimed timber flooring, energy-efficient windows, and a new heat pump system. The result is a home that's not only beautiful but also environmentally conscious and energy-efficient.`,
    year: 2023,
    facts: {
      sqm: 280,
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      garden: "Large landscaped garden"
    },
    heroImagePath: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    projectImages: [
      {
        id: "1-hero",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
        tags: ["gallery"]
      },
      {
        id: "1-before-1",
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        tags: ["before", "gallery"]
      },
      {
        id: "1-after-1",
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        tags: ["after", "gallery"]
      },
      {
        id: "1-gallery-1",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
        tags: ["gallery"]
      }
    ],
    imagePairs: [
      {
        id: "1-pair-1",
        label: "Living Room Transformation",
        beforeImageId: "1-before-1",
        afterImageId: "1-after-1"
      }
    ],
    isPublished: true
  },
  {
    title: "Luxury Apartment Redesign",
    slug: "luxury-apartment-redesign",
    summary: "High-end apartment renovation in the heart of the city",
    content: `This luxury apartment renovation showcases sophisticated design and premium finishes throughout. Located in a prestigious building, the project focused on creating a refined living space that maximizes both comfort and style.

The open-plan living area features a custom-designed kitchen with marble countertops and high-end appliances. The living space flows seamlessly into a private terrace with city views, creating an indoor-outdoor living experience.

The master bedroom suite includes a spacious walk-in closet and a spa-like bathroom with a freestanding tub and double vanity. Premium materials including marble, brass fixtures, and custom millwork create a cohesive luxury aesthetic throughout.

Smart home technology was integrated throughout, including automated lighting, climate control, and security systems. The result is a sophisticated urban retreat that perfectly balances luxury and functionality.`,
    year: 2023,
    facts: {
      sqm: 120,
      bedrooms: 2,
      bathrooms: 2,
      floor: "12th floor",
      view: "City views"
    },
    heroImagePath: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    projectImages: [
      {
        id: "2-hero",
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        tags: ["gallery"]
      },
      {
        id: "2-before-1",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
        tags: ["before", "gallery"]
      },
      {
        id: "2-after-1",
        url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
        tags: ["after", "gallery"]
      }
    ],
    imagePairs: [
      {
        id: "2-pair-1",
        label: "Kitchen & Living Area",
        beforeImageId: "2-before-1",
        afterImageId: "2-after-1"
      }
    ],
    isPublished: true
  },
  {
    title: "Family Home Extension",
    slug: "family-home-extension",
    summary: "Thoughtful extension adding space and light to a growing family home",
    content: `This family home extension project added much-needed space while maintaining the character of the original 1950s house. The design focused on creating flexible living areas that can adapt to the family's changing needs.

The new extension includes a large open-plan kitchen and dining area with floor-to-ceiling windows that flood the space with natural light. A new family room provides additional living space, while a home office offers a quiet workspace.

The master bedroom was extended to include a walk-in wardrobe and en-suite bathroom. The new spaces seamlessly connect with the existing home through careful material selection and design continuity.

Sustainable features include solar panels, improved insulation, and a rainwater harvesting system. The garden was redesigned to include a play area for children and a vegetable garden, creating a complete family environment.`,
    year: 2022,
    facts: {
      sqm: 200,
      bedrooms: 3,
      bathrooms: 2,
      extension: "40 sqm",
      garden: "Large family garden"
    },
    heroImagePath: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80",
    projectImages: [
      {
        id: "3-hero",
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80",
        tags: ["gallery"]
      },
      {
        id: "3-before-1",
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        tags: ["before", "gallery"]
      },
      {
        id: "3-after-1",
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
        tags: ["after", "gallery"]
      }
    ],
    imagePairs: [
      {
        id: "3-pair-1",
        label: "Kitchen Extension",
        beforeImageId: "3-before-1",
        afterImageId: "3-after-1"
      }
    ],
    isPublished: true
  },
  {
    title: "Historic Townhouse Restoration",
    slug: "historic-townhouse-restoration",
    summary: "Careful restoration of a 19th-century townhouse preserving original features",
    content: `This historic townhouse restoration project carefully balanced the preservation of original architectural features with modern living requirements. The 19th-century building required extensive structural work while maintaining its period character.

Original features including ornate cornices, fireplaces, and sash windows were painstakingly restored. The original floor plan was largely maintained, with careful modifications to improve functionality and meet modern building standards.

The kitchen was sensitively updated with period-appropriate cabinetry and modern appliances hidden behind traditional doors. Bathrooms were redesigned with contemporary fixtures while maintaining the building's character.

The project included the restoration of the original garden, which had been neglected for decades. A new terrace was added to provide outdoor living space while respecting the building's historic context.`,
    year: 2022,
    facts: {
      sqm: 180,
      bedrooms: 3,
      bathrooms: 2,
      period: "19th century",
      features: "Original fireplaces, sash windows"
    },
    heroImagePath: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
    projectImages: [
      {
        id: "4-hero",
        url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
        tags: ["gallery"]
      },
      {
        id: "4-before-1",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
        tags: ["before", "gallery"]
      },
      {
        id: "4-after-1",
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        tags: ["after", "gallery"]
      }
    ],
    imagePairs: [
      {
        id: "4-pair-1",
        label: "Living Room Restoration",
        beforeImageId: "4-before-1",
        afterImageId: "4-after-1"
      }
    ],
    isPublished: true
  },
  {
    title: "Contemporary Loft Conversion",
    slug: "contemporary-loft-conversion",
    summary: "Industrial loft transformed into a modern living space",
    content: `This loft conversion project transformed an industrial space into a stunning contemporary home. The open-plan design maximizes the building's high ceilings and large windows, creating a bright and airy living environment.

The main living area features a custom-designed kitchen island that serves as both a cooking station and social hub. Exposed brick walls and original timber beams were preserved and highlighted as key design features.

The sleeping area is separated by a custom-built storage wall that provides privacy while maintaining the open feel. A mezzanine level was added to create additional living space and a home office.

The design incorporates industrial elements including exposed ductwork and concrete floors, balanced with warm materials like timber and soft textiles. The result is a unique living space that celebrates the building's industrial heritage while providing modern comfort.`,
    year: 2023,
    facts: {
      sqm: 150,
      bedrooms: 1,
      bathrooms: 1,
      ceiling: "4.5m high",
      features: "Exposed brick, timber beams"
    },
    heroImagePath: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    projectImages: [
      {
        id: "5-hero",
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        tags: ["gallery"]
      },
      {
        id: "5-before-1",
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        tags: ["before", "gallery"]
      },
      {
        id: "5-after-1",
        url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
        tags: ["after", "gallery"]
      }
    ],
    imagePairs: [
      {
        id: "5-pair-1",
        label: "Main Living Space",
        beforeImageId: "5-before-1",
        afterImageId: "5-after-1"
      }
    ],
    isPublished: true
  }
];

async function importProjects() {
  console.log('🚀 Starting one-time project import...');
  
  const db = createDbClient();
  let imported = 0;
  let skipped = 0;

  for (const project of sampleProjects) {
    try {
      // Check if project already exists
      const existing = await db.select().from(projects).where(eq(projects.slug, project.slug)).limit(1);
      
      if (existing.length > 0) {
        console.log(`⚠️  Project "${project.slug}" already exists, skipping...`);
        skipped++;
        continue;
      }

      // Insert project
      await db.insert(projects).values({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        content: project.content,
        year: project.year,
        facts: project.facts,
        heroImagePath: project.heroImagePath,
        projectImages: project.projectImages,
        imagePairs: project.imagePairs,
        isPublished: project.isPublished,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Imported: ${project.title}`);
      imported++;
      
    } catch (error) {
      console.error(`❌ Error importing ${project.title}:`, error);
    }
  }

  console.log(`\n🎉 Import completed!`);
  console.log(`✅ Successfully imported: ${imported} projects`);
  console.log(`⚠️  Skipped (already exist): ${skipped} projects`);
}

// Run the import
importProjects().catch(console.error);
