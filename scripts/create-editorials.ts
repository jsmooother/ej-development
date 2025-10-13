import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { posts } from '../src/lib/db/schema';
import { randomUUID } from 'crypto';

config({ path: '.env.local' });

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  throw new Error('SUPABASE_DB_URL not found in environment');
}

const client = postgres(dbUrl);
const db = drizzle(client);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const editorialData = [
  // MARBELLA PROPERTIES (4 stories)
  {
    title: "The Golden Mile: Where Luxury Meets Legacy",
    slug: "golden-mile-luxury-legacy",
    excerpt: "Discover why Marbella's Golden Mile remains the most prestigious address on the Costa del Sol, attracting royalty, celebrities, and discerning investors.",
    content: `The Golden Mile is more than just a stretch of coastline—it's a lifestyle statement. Running from Marbella's western edge to Puerto Banús, this iconic boulevard has been the playground of European aristocracy since the 1940s.

Today, the Golden Mile continues to set the standard for Mediterranean luxury. The area is home to some of Europe's most exclusive properties, from the legendary Marbella Club Hotel to contemporary beachfront villas with private access to pristine beaches.

What makes the Golden Mile special is its perfect balance of privacy and proximity. Residents enjoy the tranquility of gated communities like Sierra Blanca and Cascada de Camoján, yet are mere minutes from Marbella's vibrant town center and Puerto Banús marina.

The area has seen a surge in branded residences and ultra-modern villas that blend cutting-edge design with traditional Andalusian charm. Properties here offer more than just a home—they provide a gateway to an elevated lifestyle of year-round sunshine, world-class dining, and unparalleled coastal beauty.

For those seeking the ultimate Marbella address, the Golden Mile represents both a legacy of glamour and a promise of timeless value.`,
    category: "properties",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "La Zagaleta: Inside Europe's Most Exclusive Gated Community",
    slug: "la-zagaleta-exclusive-community",
    excerpt: "Step inside La Zagaleta, where billionaires and celebrities call home in one of the world's most secure and luxurious residential developments.",
    content: `Perched in the hills behind Marbella, La Zagaleta is not just a gated community—it's a private country club that happens to have some of the world's most spectacular homes within its 900 hectares.

With only 230 plots, La Zagaleta is intentionally exclusive. The estates here are vast, often spanning several acres, ensuring complete privacy for residents who include international business leaders, royalty, and A-list celebrities.

What sets La Zagaleta apart is its comprehensive approach to luxury living. Two 18-hole golf courses wind through the estate, while an equestrian center, helipad, and 24/7 security provide every amenity and assurance residents could desire.

The architecture is equally impressive. From Andalusian-style mansions to contemporary masterpieces, each property is a statement of individual taste backed by world-class construction. Many feature indoor pools, private spas, wine cellars, and entertainment complexes that rival five-star resorts.

Despite its seclusion in the mountains, La Zagaleta is remarkably accessible—just 15 minutes from Puerto Banús and 45 minutes from Málaga airport. It's this combination of privacy, prestige, and practicality that makes La Zagaleta the ultimate address for those who value absolute discretion.`,
    category: "properties",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "New Build vs. Classic Villa: Your Marbella Investment Guide",
    slug: "new-build-vs-classic-villa-guide",
    excerpt: "Choosing between a contemporary new build and a renovated classic villa? Here's what you need to know to make the right investment decision.",
    content: `The Marbella property market offers two distinct paths to luxury living: ultra-modern new builds with cutting-edge technology, or beautifully renovated classic villas with character and heritage.

New builds in Marbella have evolved dramatically. Today's developments feature smart home systems, energy-efficient designs, and sleek architectural lines that maximize natural light and sea views. Developments like Los Flamingos and La Reserva de Alcuzcuz showcase how contemporary design can harmonize with the Mediterranean landscape.

The advantages are clear: everything is brand new, under warranty, and built to current building codes. You'll enjoy lower maintenance costs, better insulation, and often access to communal facilities like gyms, pools, and concierge services.

Classic villas, on the other hand, offer something money can't buy: established gardens, mature trees, and the charm of traditional Andalusian architecture. A well-renovated property in Nueva Andalucía or the Golden Mile provides generous plot sizes often unavailable in new developments.

The investment angle varies too. New builds typically appreciate as the development matures and surrounding infrastructure improves. Classic villas in prime locations often hold their value better during market fluctuations, thanks to their irreplaceable positions and land value.

Your choice ultimately depends on your lifestyle preferences and investment timeline. Both paths lead to exceptional Marbella living—just by different routes.`,
    category: "properties",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Beachfront Living: Your Guide to Marbella's Coastal Properties",
    slug: "beachfront-living-marbella-coastal",
    excerpt: "From exclusive beachfront apartments to sprawling coastal villas, discover what it's really like to live steps from the Mediterranean.",
    content: `Waking up to the sound of waves and stepping onto your terrace to panoramic sea views—this is the reality of beachfront living in Marbella, and it's as magical as it sounds.

Marbella's coastline offers diverse options for beachfront living. The Marbella East area, including Los Monteros and Elviria, features exclusive complexes with direct beach access, often with beach clubs and restaurants at your doorstep. These properties range from contemporary penthouses to ground-floor apartments with private gardens leading to the sand.

The Golden Mile presents a different flavor—here, beachfront living often means gated communities with 24/7 security, tropical gardens, and heated pools. Properties like Puente Romano and Los Granados offer not just homes but complete resort lifestyles.

For those seeking ultimate privacy, beachfront villas in areas like Casablanca Beach or Guadalmina offer private plots with direct beach access. These rare properties provide the space and exclusivity that defines true luxury coastal living.

The investment perspective is compelling. Beachfront properties in Marbella have shown consistent appreciation, driven by limited supply and enduring demand. Rental yields are strong, particularly for properties with easy beach access and high-quality amenities.

Year-round, the climate allows you to enjoy your beachfront lifestyle. Morning swims in summer, sunset walks in autumn, and that unmistakable fresh sea air every day of the year—this is what makes Marbella's beachfront properties so special.`,
    category: "properties",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop",
    isPublished: true,
  },

  // LOCAL RESTAURANTS, BEACHES & LIFESTYLE (4 stories)
  {
    title: "A Culinary Journey Through Marbella's Finest Restaurants",
    slug: "culinary-journey-marbella-restaurants",
    excerpt: "From Michelin-starred excellence to authentic chiringuitos, discover the dining scene that makes Marbella a gastronomic paradise.",
    content: `Marbella's restaurant scene is a reflection of its international character—sophisticated, diverse, and uncompromisingly excellent. The city has evolved into one of Europe's premier dining destinations, where you can savor Michelin-starred cuisine one evening and feast on fresh seafood at a beach chiringuito the next.

The Marbella Club and Puente Romano hotels host some of the finest restaurants on the coast. Dani García's Leña offers innovative takes on traditional Andalusian flavors, while El Lago at Elviria holds a Michelin star for its creative Mediterranean cuisine.

Puerto Banús and Marbella's old town present contrasting but equally compelling dining experiences. The marina glitters with celebrity chef restaurants and sophisticated international cuisine, while the old town's narrow streets hide tapas bars where locals have gathered for generations.

What makes Marbella special is the quality of ingredients. The morning fish market supplies restaurants with catches from that very day. Organic produce comes from nearby farms in the Guadalhorce valley. Spanish ham, local olive oil, and seasonal vegetables form the foundation of exceptional cooking.

Beach clubs along the coast—from Nikki Beach to La Cabane—have elevated the chiringuito concept to an art form. Here, you can enjoy fresh grilled sardines and paella with your feet in the sand, or opt for sushi and champagne as the sun sets over the Mediterranean.

For food lovers, Marbella offers an endless journey of discovery, where every meal is an opportunity to taste the good life.`,
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "The Ultimate Guide to Marbella's Best Beaches",
    slug: "ultimate-guide-marbella-beaches",
    excerpt: "With 27 kilometers of coastline, Marbella offers beaches for every mood—from vibrant beach clubs to secluded coves.",
    content: `Marbella's beaches are as diverse as the people who visit them. Each stretch of sand has its own character, attracting different crowds and offering unique experiences.

Nikki Beach is perhaps the most famous—a global brand that epitomizes Marbella's glamorous beach culture. White beds, champagne service, and international DJs create an atmosphere that's part beach club, part exclusive party. It's where you'll spot celebrities, enjoy world-class cuisine, and dance as the sun sets.

For families and those seeking a more relaxed vibe, Playa de Nagüeles offers calm waters and excellent facilities. The promenade is perfect for evening strolls, with playgrounds, restaurants, and the iconic Marbella dunes providing natural beauty.

Hidden gems exist too. Cabopino Beach, at Marbella's eastern edge, features natural sand dunes and a quieter atmosphere. The nudist-friendly section and the beautiful marina nearby make it popular with open-minded locals and visitors seeking authenticity.

The beach clubs deserve special mention. Trocadero Arena and La Cabane offer sophisticated dining and comfortable sun loungers, transforming a beach day into a luxury experience. Ocean Club brings a more relaxed, family-friendly approach to beach club culture.

What unites all Marbella beaches is the quality. Blue Flag status, regular cleaning, lifeguards in summer, and that perfect Mediterranean climate mean you can enjoy beach life almost year-round. Whether you want glamour, tranquility, or family fun, Marbella's coastline delivers.`,
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Puerto Banús: Beyond the Superyachts",
    slug: "puerto-banus-beyond-superyachts",
    excerpt: "Discover the many faces of Puerto Banús—from luxury shopping and fine dining to hidden local spots only residents know.",
    content: `Puerto Banús is famous for its superyachts, designer boutiques, and celebrity sightings—but scratch beneath the surface and you'll discover a multifaceted destination that offers far more than its glitzy reputation suggests.

The marina itself is undeniably impressive. Multimillion-euro yachts line the docks, while the waterfront buzzes with luxury sports cars and people-watching opportunities. But venture beyond the main strip and you'll find authentic tapas bars, local seafood restaurants, and a community that has evolved beyond the tourist brochure image.

Shopping in Puerto Banús spans the spectrum from haute couture to Spanish fashion. El Corte Inglés anchors the commercial area, while boutiques of Dior, Gucci, and Louis Vuitton satisfy luxury shoppers. But the surrounding streets offer independent shops, local artisans, and markets selling everything from antiques to fresh produce.

The beach clubs—Ocean Club, Sala Beach, and La Sala by the Sea—provide daytime glamour with excellent food and service. As evening arrives, the atmosphere shifts. Restaurants like Cipriani and La Pesquera serve exceptional Italian and seafood respectively, while bars and clubs come alive with international DJs and sophisticated cocktails.

For residents, Puerto Banús is also practical. The Centro Plaza shopping center offers supermarkets, services, and everyday necessities. The weekly market brings local flavor, and the proximity to golf courses, spas, and fitness centers makes it a genuinely liveable location.

Puerto Banús is where Marbella shows its most glamorous face—but it's also a real community where people live, shop, and create memories year-round.`,
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "The Marbella Golf Valley: Paradise for Golf Enthusiasts",
    slug: "marbella-golf-valley-paradise",
    excerpt: "With over 50 golf courses within 30 minutes, discover why Marbella is Europe's premier golfing destination.",
    content: `The Golf Valley in Nueva Andalucía isn't just a name—it's a promise. This area, nestled in the hills behind Puerto Banús, is home to some of Europe's finest golf courses, creating a paradise for golfers that extends far beyond the sport itself.

Los Naranjos, La Quinta, and Aloha Golf Club form the valley's core. Each course offers distinct challenges and stunning mountain or sea views. Los Naranjos, designed by Robert Trent Jones Sr., is a masterpiece of strategic golf design. La Quinta provides dramatic elevation changes and panoramic vistas. Aloha combines challenging play with one of the area's most active social scenes.

But the Golf Valley offers more than just courses. The area has developed into a desirable residential location, with properties ranging from golf-view apartments to luxury villas on elevated plots. Living here means morning rounds on world-class courses, lunch at sophisticated clubhouses, and afternoons by your private pool—all within minutes of Puerto Banús.

The social aspect is equally important. Golf clubs host events, tournaments, and social gatherings that form the backbone of the expatriate community. It's where friendships form, business relationships develop, and the international community connects.

Beyond the valley, Marbella offers incredible variety. The legendary Valderrama, host of the 1997 Ryder Cup, is 30 minutes away. Villa Padierna's three courses offer luxury golf resort experiences. Finca Cortesín, recently host to the Solheim Cup, provides championship-level challenge.

For golf enthusiasts, Marbella delivers not just excellent courses but an entire lifestyle built around the sport, blessed with year-round sunshine and unmatched facilities.`,
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&auto=format&fit=crop",
    isPublished: true,
  },

  // CULTURAL LIFE (4 stories)
  {
    title: "Marbella's Old Town: Where History Meets Modern Charm",
    slug: "marbella-old-town-history-charm",
    excerpt: "Wander through the whitewashed streets of Marbella's Casco Antiguo and discover a world of Andalusian culture, art galleries, and timeless beauty.",
    content: `Step into Marbella's old town, and you're transported to a different era. The Casco Antiguo—the historic heart of Marbella—is a labyrinth of narrow, whitewashed streets, flower-filled balconies, and hidden plazas that have remained largely unchanged for centuries.

The centerpiece is the Plaza de los Naranjos (Orange Square), where orange trees provide shade for outdoor cafés and restaurants. This 15th-century square, built after the Christian reconquest, remains the social heart of the old town. Here, locals and visitors mingle over coffee, tapas, and conversation.

Architectural treasures abound. The 16th-century Church of Nuestra Señora de la Encarnación showcases beautiful Baroque and Mudéjar elements. The Ermita de Santiago, Marbella's oldest religious building, dates back to the 15th century. The Arab walls and castle ruins remind us of Marbella's Moorish heritage.

But the old town isn't a museum—it's a living, breathing community. Art galleries showcase contemporary Spanish and international artists. Boutique shops sell artisan goods, from hand-painted ceramics to handcrafted jewelry. Traditional tapas bars serve the same recipes they've perfected over generations.

The weekly market on Monday mornings transforms the old town into a vibrant bazaar. Fresh produce, local cheeses, artisan crafts, and clothing stalls create an authentic Spanish market experience.

As evening falls, the old town reveals another character. Restaurants light up, flamenco music drifts from doorways, and the streets fill with people enjoying the Andalusian tradition of the paseo—the evening stroll.

This is Marbella's soul—a perfect blend of history, culture, and contemporary life that makes the old town essential to understanding what makes this city special.`,
    category: "culture",
    imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Art and Culture in Marbella: A Thriving Creative Scene",
    slug: "art-culture-marbella-creative-scene",
    excerpt: "From contemporary art galleries to cultural festivals, discover Marbella's flourishing artistic community and cultural calendar.",
    content: `Marbella's reputation as a glamorous resort town often overshadows its vibrant arts and culture scene. Yet the city has cultivated a sophisticated cultural landscape that attracts artists, collectors, and culture enthusiasts from around the world.

The Ralli Museum, located in the exclusive Coral Beach area, houses an impressive collection of contemporary Latin American and European art. Admission is free—a gift to the community from its founder—making world-class art accessible to all.

The Museo del Grabado Español Contemporáneo (Museum of Spanish Contemporary Engraving) occupies a beautiful 16th-century building in the old town. Its collection includes works by Picasso, Miró, and Dalí, representing the finest Spanish graphic art from the 20th century.

Gallery scenes flourish throughout Marbella and Puerto Banús. The Marbella Art Fair, held annually, attracts international galleries and collectors. Throughout the summer, outdoor sculpture exhibitions transform the promenade into an open-air gallery.

The cultural calendar is equally impressive. The Marbella International Film Festival attracts filmmakers and actors from around the globe. The Starlite Festival brings world-renowned musicians to perform in a magical outdoor setting. Flamenco performances, from intimate tablaos to grand productions, keep this quintessentially Spanish art form alive.

The Teatro Ciudad de Marbella hosts theater, dance, and classical music throughout the year. The recently renovated auditorium showcases both Spanish and international productions, from contemporary dance to classical ballet.

For a city known for beaches and luxury, Marbella's commitment to arts and culture adds unexpected depth. It's a place where you can enjoy a Michelin-starred meal, attend a world-class concert, and view contemporary art—all in one extraordinary day.`,
    category: "culture",
    imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "The Marbella International Community: A Global Village",
    slug: "marbella-international-community-global",
    excerpt: "Discover what it's like to live in one of Europe's most international cities, where over 140 nationalities call Marbella home.",
    content: `Marbella is remarkable for its international character. Walk through the streets and you'll hear conversations in English, German, Swedish, Russian, Arabic, and countless other languages. This cosmopolitan atmosphere is one of Marbella's greatest strengths—creating a globally-minded community that celebrates diversity.

The numbers are striking: over 140 nationalities are registered as residents in Marbella. This isn't just tourists passing through—these are people who have chosen to make Marbella their home, creating a permanent international community that shapes the city's character.

International schools reflect this diversity. The English International College, Aloha College, and Swans International School offer British curriculum education. The German school serves the substantial German-speaking community. These institutions aren't just schools—they're community hubs where international families connect.

Business networking groups, sports clubs, and social organizations cater to various nationalities while encouraging cross-cultural interaction. The International Club of Marbella, Rotary clubs, and business associations provide platforms for networking and friendship.

The practical advantages are significant. English is widely spoken, making daily life easy for international residents. Lawyers, accountants, and real estate agents specializing in expatriate needs are readily available. International healthcare facilities and multilingual services are the norm, not the exception.

Yet Marbella hasn't lost its Spanish identity. The local community remains strong, traditional festivals continue, and Spanish culture forms the foundation upon which this international diversity is built.

This blend—genuine Spanish culture enriched by international influences—creates a unique environment. It's a place where you can feel at home while experiencing the world, where your neighbor might be from Stockholm and your business partner from London, but you're all united by your love for Marbella.`,
    category: "culture",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Year-Round Living: Why Marbella's Climate Changes Everything",
    slug: "year-round-living-marbella-climate",
    excerpt: "With 320 days of sunshine and mild winters, discover how Marbella's microclimate creates the perfect environment for outdoor living all year.",
    content: `Marbella's climate isn't just good—it's extraordinary. The city enjoys a unique microclimate protected by the Sierra Blanca mountains, creating conditions that many consider the best in Europe for year-round outdoor living.

The statistics tell the story: over 320 days of sunshine annually, average temperatures of 18°C in winter and 28°C in summer, and minimal rainfall concentrated mainly in autumn and winter months. But these numbers don't capture what this really means for daily life.

Winter in Marbella redefines the season. December through February sees daytime temperatures regularly reaching 18-20°C. You can golf, play tennis, or dine outdoors on most winter days. Morning frost is virtually unknown along the coast, and snow is something you see on distant mountain peaks—if you see it at all.

Spring and autumn are arguably Marbella's finest seasons. Temperatures hover in the ideal 20-25°C range, perfect for hiking in the nearby mountains, cycling along coastal paths, or simply enjoying your terrace without air conditioning or heating.

Even summer, while warm, is tempered by sea breezes. Coastal properties benefit from natural ventilation, and the low humidity makes heat more bearable than in many Mediterranean destinations. Evening temperatures drop comfortably, allowing for pleasant outdoor dining and socializing.

This climate shapes lifestyle choices. Outdoor spaces aren't just decorative—they're functional living areas used year-round. Gardens bloom in winter, pools are usable from April to October, and outdoor entertaining is possible every month.

For those relocating from northern Europe, the health and wellness benefits are tangible. More outdoor activity, increased vitamin D, and the psychological benefits of regular sunshine contribute to an improved quality of life.

Marbella's climate isn't just a feature—it's the foundation of a lifestyle that prioritizes outdoor living, wellness, and year-round enjoyment of one of Europe's most beautiful coastlines.`,
    category: "culture",
    imageUrl: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1200&auto=format&fit=crop",
    isPublished: true,
  },
];

async function createEditorials() {
  console.log('🎨 Creating Marbella editorial stories...\n');

  for (const editorial of editorialData) {
    try {
      await db.insert(posts).values({
        id: randomUUID(),
        slug: editorial.slug,
        title: editorial.title,
        excerpt: editorial.excerpt,
        content: editorial.content,
        imageUrl: editorial.imageUrl,
        isPublished: editorial.isPublished,
        publishedAt: editorial.isPublished ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Created: ${editorial.title} (${editorial.category})`);
    } catch (error) {
      console.error(`❌ Failed to create ${editorial.title}:`, error);
    }
  }

  console.log('\n🎉 All editorial stories created successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 4 Property stories');
  console.log('   - 4 Lifestyle stories (restaurants, beaches, golf)');
  console.log('   - 4 Culture stories (old town, arts, community, climate)');
  console.log('\n✨ Your editorial section is now filled with inspiring Marbella content!');
}

createEditorials()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

