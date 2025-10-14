#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { getDb } from '../src/lib/db/index';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

const fullContent = `A landmark restoration that celebrates heritage while embracing innovation. Wallin Revival takes a classic early 1900s apartment with soaring ceilings and reimagines it as a masterpiece of modern engineering and interior architecture. This transformation was executed with total precision — from structural reinforcement and custom electrical planning to the integration of advanced lighting control, acoustic design, and sustainable materials.

Every inch of this space has been elevated through bespoke craftsmanship. The original plasterwork and parquetry were meticulously restored, while new elements — including handcrafted cabinetry, intelligent storage systems, and zoned heating — were seamlessly introduced to enhance both form and function. The color palette harmonizes natural walnut, brushed brass, and creamy marble, bringing a luxurious tactile rhythm to each room.

Hidden beneath its classic façade lies a sophisticated network of smart systems controlling temperature, air quality, and light intensity with silent precision. Each decision — from the placement of an outlet to the curve of a molding — reflects a pursuit of perfection. Wallin Revival is where tradition meets technology, art meets engineering, and craftsmanship meets comfort — a residence designed for those who value both heritage and innovation at the highest level.`;

async function restoreContent() {
  const db = getDb();
  
  console.log('🔄 Restoring Wallin Revival content...\n');
  
  // Get current project
  const current = await db.select().from(projects).where(eq(projects.slug, 'wallin-revival')).limit(1);
  
  if (!current || current.length === 0) {
    console.error('❌ Project not found');
    return;
  }
  
  console.log('Current content length:', current[0].content?.length || 0);
  console.log('New content length:', fullContent.length);
  
  // Update with full content
  const result = await db
    .update(projects)
    .set({
      content: fullContent,
      updatedAt: new Date()
    })
    .where(eq(projects.slug, 'wallin-revival'))
    .returning();
  
  if (result && result.length > 0) {
    console.log('\n✅ Content restored successfully!');
    console.log('   Updated content length:', result[0].content?.length || 0);
  } else {
    console.error('❌ Failed to update');
  }
}

restoreContent().catch(console.error);

