import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { posts } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  throw new Error('SUPABASE_DB_URL not found in environment');
}

const client = postgres(dbUrl);
const db = drizzle(client);

const imageMapping: { [key: string]: string } = {
  'golden-mile-luxury-legacy': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop',
  'la-zagaleta-exclusive-community': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop',
  'new-build-vs-classic-villa-guide': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
  'beachfront-living-marbella-coastal': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop',
  'culinary-journey-marbella-restaurants': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop',
  'ultimate-guide-marbella-beaches': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop',
  'puerto-banus-beyond-superyachts': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&auto=format&fit=crop',
  'marbella-golf-valley-paradise': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&auto=format&fit=crop',
  'marbella-old-town-history-charm': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&auto=format&fit=crop',
  'art-culture-marbella-creative-scene': 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&auto=format&fit=crop',
  'marbella-international-community-global': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop',
  'year-round-living-marbella-climate': 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1200&auto=format&fit=crop',
};

async function updateEditorialImages() {
  console.log('🎨 Updating editorial cover images...\n');

  for (const [slug, imageUrl] of Object.entries(imageMapping)) {
    try {
      await db
        .update(posts)
        .set({ coverImagePath: imageUrl })
        .where(eq(posts.slug, slug));

      console.log(`✅ Updated: ${slug}`);
    } catch (error) {
      console.error(`❌ Failed to update ${slug}:`, error);
    }
  }

  console.log('\n🎉 All editorial images updated successfully!');
}

updateEditorialImages()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

