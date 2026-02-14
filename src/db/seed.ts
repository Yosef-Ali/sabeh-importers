import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env' });

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('🌱 Seeding database with 100 Ethiopian-focused listings...\n');

  // Pre-hash passwords (cost=10 is fast enough for seeding)
  const [adminHash, sellerHash, buyerHash, seller2Hash] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('seller123', 10),
    bcrypt.hash('buyer123', 10),
    bcrypt.hash('mekdes2024', 10),
  ]);
  console.log('✓ Passwords hashed');
  console.log('  admin@sabeh.com       → admin123');
  console.log('  seller@sabeh.com      → seller123');
  console.log('  buyer@sabeh.com       → buyer123');
  console.log('  mekdes@sabeh.com      → mekdes2024  (registered seller)\n');

  // Clear existing data (optional, but good for a fresh start in development)
  console.log('Cleaning existing data...');
  await db.delete(schema.listings);
  await db.delete(schema.categories);
  await db.delete(schema.users);

  // ─── 1. CREATE USERS ──────────────────────────────
  console.log('Creating users...');

  const [admin] = await db.insert(schema.users).values({
    email: 'admin@sabeh.com',
    name: 'Admin User',
    nameAmharic: 'አስተዳዳሪ',
    phone: '+251911000001',
    password: adminHash,
    role: 'ADMIN',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
  }).returning();

  const [seller] = await db.insert(schema.users).values({
    email: 'seller@sabeh.com',
    name: 'Yosef Ali',
    nameAmharic: 'ዮሴፍ አሊ',
    phone: '+251911223344',
    password: sellerHash,
    role: 'SELLER',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
    responseRate: 98,
    responseTime: 'under 15 mins',
  }).returning();

  await db.insert(schema.users).values({
    email: 'buyer@sabeh.com',
    name: 'Hagos Belay',
    phone: '+251911556677',
    password: buyerHash,
    role: 'BUYER',
    isActive: true,
  });

  await db.insert(schema.users).values({
    email: 'mekdes@sabeh.com',
    name: 'Mekdes Yared',
    nameAmharic: 'መቅደስ ያሬድ',
    phone: '+251922334455',
    password: seller2Hash,
    role: 'SELLER',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
    responseRate: 95,
    responseTime: 'under 1 hour',
    bio: 'Verified seller specialising in premium motors and real estate in Addis Ababa. 5+ years on Sabeh.',
  }).returning();

  // ─── 2. CREATE CATEGORIES ─────────────────────────
  console.log('Creating categories...');
  const categoryData = [
    { name: 'Motors', nameAmharic: 'ተሽከርካሪዎች', slug: 'motors', icon: 'Car', sortOrder: 1 },
    { name: 'Property', nameAmharic: 'ንብረት', slug: 'property', icon: 'Home', sortOrder: 2 },
    { name: 'Electronics', nameAmharic: 'ኤሌክትሮኒክስ', slug: 'electronics', icon: 'Smartphone', sortOrder: 3 },
    { name: 'Furniture & Home', nameAmharic: 'የቤት ዕቃዎች', slug: 'furniture-home', icon: 'Sofa', sortOrder: 4 },
    { name: 'Jobs', nameAmharic: 'ሥራ', slug: 'jobs', icon: 'Briefcase', sortOrder: 5 },
    { name: 'Services', nameAmharic: 'አገልግሎቶች', slug: 'services', icon: 'Wrench', sortOrder: 6 },
    { name: 'Fashion & Beauty', nameAmharic: 'ፋሽን እና ውበት', slug: 'fashion-beauty', icon: 'Shirt', sortOrder: 7 },
    { name: 'Business for Sale', nameAmharic: 'ለሽያጭ የቀረቡ ንግዶች', slug: 'business-for-sale', icon: 'Building', sortOrder: 8 },
    { name: 'Industrial Equipment', nameAmharic: 'የኢንዱስትሪ መሣሪያዎች', slug: 'industrial-equipment', icon: 'Factory', sortOrder: 9 },
    { name: 'Community', nameAmharic: 'ማህበረሰብ', slug: 'community', icon: 'Users', sortOrder: 10 },
  ];

  const parentCategories = await db.insert(schema.categories)
    .values(categoryData)
    .returning();

  // ─── 3. PREPARE ASSETS ────────────────────────────
  // Using picsum.photos with stable seed-based URLs (same seed = same image every time)
  // These are real photos from Unsplash served via picsum.photos CDN
  const motorImages = [
    'https://picsum.photos/seed/car-mercedes/800/600',
    'https://picsum.photos/seed/car-landcruiser/800/600',
    'https://picsum.photos/seed/car-kia/800/600',
    'https://picsum.photos/seed/car-vespa/800/600',
    'https://picsum.photos/seed/car-bajaj/800/600',
    'https://picsum.photos/seed/car-truck/800/600',
    'https://picsum.photos/seed/car-hyundai/800/600',
    'https://picsum.photos/seed/car-ford/800/600',
    'https://picsum.photos/seed/car-corolla/800/600',
    'https://picsum.photos/seed/car-byd/800/600',
  ];

  const propertyImages = [
    'https://picsum.photos/seed/property-apt1/800/600',
    'https://picsum.photos/seed/property-villa1/800/600',
  ];

  const genericImages = [
    'https://picsum.photos/seed/electronics-phone/800/600',
    'https://picsum.photos/seed/furniture-sofa/800/600',
  ];

  // ─── DEVELOPER NOTE: HOW TO MODIFY SEED DATA ─────────────────────
  // 1. To Change Listing Images:
  //    - Update `detailedProductAssets` object below with new file paths or URLs.
  //    - Ensure local images are placed in `public/images/products/[category]/[slug]/`.
  //    - Format: `['/path/to/img1.png', '/path/to/img2.png', ...]` (5 images recommended).
  //
  // 2. To Add New Seed Products:
  //    - Add a new entry to the `detailedProductAssets` map with a unique slug key.
  //    - The seeding loop (approx line 200) attempts to match listing titles to these keys.
  //    - For forced specific items (like the LC300), see the specific logic inside the category loops (e.g., `if (category.slug === 'motors')`).
  //
  // 3. To Reset Database:
  //    - Run `npm run db:push` to sync schema (if changed).
  //    - Run `npm run db:seed` to clear and repopulate tables.
  // ──────────────────────────────────────────────────────────────────

  // Map of specific product titles (slug-like) to high-quality image arrays (5 images each)
  const detailedProductAssets: Record<string, string[]> = {
    'land-cruiser-300': [
      '/images/products/motors/land-cruiser-300/hero.png',
      '/images/products/motors/land-cruiser-300/interior.png',
      '/images/products/motors/land-cruiser-300/engine.png',
      '/images/products/motors/land-cruiser-300/rear.png',
      '/images/products/motors/land-cruiser-300/action.png',
    ],
    'luxury-apartment': [
      '/images/products/property/luxury-apartment/hero.png',
      '/images/products/property/luxury-apartment/living.png',
      '/images/products/property/luxury-apartment/kitchen.png',
      '/images/products/property/luxury-apartment/bedroom.png',
      '/images/products/property/luxury-apartment/view.png',
    ],
    'byd-seagull': [
      '/images/products/motors/byd-seagull/hero.png',
      '/images/products/motors/byd-seagull/interior.png',
      '/images/products/motors/byd-seagull/detail.png',
      '/images/products/motors/byd-seagull/rear.png',
      '/images/products/motors/byd-seagull/action.png',
    ],
    'luxury-villa': [
      '/images/products/property/luxury-villa/hero.png',
      '/images/products/property/luxury-villa/garden.png',
      '/images/products/property/luxury-villa/living.png',
      '/images/products/property/luxury-villa/kitchen.png',
      '/images/products/property/luxury-villa/bedroom.png',
    ],
  };

  const locations = [
    { loc: 'Bole, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'CMC, Addis Ababa', city: 'Addis Ababa' },
    { loc: '4 Kilo, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Merkato, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Old Airport, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Kazanchis, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Kality, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Haya Hulet, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Lebu, Addis Ababa', city: 'Addis Ababa' },
    { loc: 'Bishoftu', city: 'Bishoftu' },
    { loc: 'Adama', city: 'Adama' },
    { loc: 'Bahir Dar', city: 'Bahir Dar' },
    { loc: 'Hawassa', city: 'Hawassa' },
  ];

  // ─── 4. GENERATE 100 LISTINGS ─────────────────────
  console.log('Generating 100 listings...');
  const listings: any[] = [];
  const targetSeller = seller || admin;

  for (let i = 1; i <= 100; i++) {
    const category = parentCategories[i % parentCategories.length];
    let location = locations[i % locations.length];

    let images: string[] = [];
    let title = '';
    let price = '1000';

    if (category.slug === 'motors') {
      const isLC300 = i === 10; // First motor is at i=10 (10 % 10 = 0)
      const isBYD = i === 20; // Second specific motor at i=20

      if (isLC300) {
        title = 'Toyota Land Cruiser 300';
        price = '18000000';
      } else if (isBYD) {
        title = 'BYD Seagull EV';
        price = '2800000';
      } else {
        title = `Toyota ${i % 2 === 0 ? 'Sedan' : 'SUV'} - 202${i % 5} Model`;
        price = (Math.floor(Math.random() * 5000000) + 500000).toString();
      }
      images = [motorImages[i % motorImages.length]];
    } else if (category.slug === 'property') {
      const isDetailedApt = i === 1; // First property is at i=1 (1 % 10 = 1)
      const isVilla = i === 11; // Second property at i=11 (11 % 10 = 1)

      if (isDetailedApt) {
        title = 'Modern Luxury Apartment';
        price = '12000000';
      } else if (isVilla) {
        title = 'Luxury Villa in CMC';
        price = '45000000';
        location = { loc: 'CMC, Addis Ababa', city: 'Addis Ababa' };
      } else {
        title = `${i % 2 !== 0 ? 'Luxury Villa' : 'Modern Apartment'} in ${location.loc}`;
        price = (Math.floor(Math.random() * 20000000) + 2000000).toString();
      }
      images = [propertyImages[i % propertyImages.length]];
    } else if (category.slug === 'electronics') {
      const electronicsImages = [
        'https://picsum.photos/seed/elec-phone/800/600',
        'https://picsum.photos/seed/elec-laptop/800/600',
        'https://picsum.photos/seed/elec-tv/800/600',
        'https://picsum.photos/seed/elec-tablet/800/600',
      ];
      images = [electronicsImages[i % electronicsImages.length]];
      title = `${['Samsung Galaxy', 'Apple iPhone', 'HP Laptop', 'Sony TV', 'iPad'][i % 5]} - ${i % 3 === 0 ? 'Brand New' : 'Like New'}`;
      price = (Math.floor(Math.random() * 80000) + 5000).toString();
    } else if (category.slug === 'furniture-home') {
      const furnitureImages = [
        'https://picsum.photos/seed/furn-sofa/800/600',
        'https://picsum.photos/seed/furn-bed/800/600',
        'https://picsum.photos/seed/furn-table/800/600',
        'https://picsum.photos/seed/furn-chair/800/600',
      ];
      images = [furnitureImages[i % furnitureImages.length]];
      title = `${['Leather Sofa Set', 'King Bed Frame', 'Dining Table Set', 'Office Chair', 'Wardrobe'][i % 5]} - ${location.city}`;
      price = (Math.floor(Math.random() * 50000) + 2000).toString();
    } else if (category.slug === 'industrial-equipment') {
      const industrialImages = [
        'https://picsum.photos/seed/ind-generator/800/600',
        'https://picsum.photos/seed/ind-machine/800/600',
        'https://picsum.photos/seed/ind-equipment/800/600',
      ];
      images = [industrialImages[i % industrialImages.length]];
      title = `${['Industrial Generator', 'Welding Machine', 'Forklift', 'Air Compressor', 'Metal Lathe'][i % 5]} - Heavy Duty`;
      price = (Math.floor(Math.random() * 500000) + 20000).toString();
    } else {
      images = [genericImages[i % genericImages.length]];
      title = `Premium ${category.name} Item - Special Offer #${i}`;
      price = (Math.floor(Math.random() * 100000) + 1000).toString();
    }

    // Check if we have a detailed asset set for this product title (case-insensitive slug match)
    const productSlug = title.toLowerCase().replace(/ /g, '-');
    for (const [key, assets] of Object.entries(detailedProductAssets)) {
      if (productSlug.includes(key)) {
        images = assets;
        break;
      }
    }

    const isLC300 = productSlug.includes('land-cruiser-300');
    const isDetailedApt = productSlug.includes('luxury-apartment');
    const isBYD = productSlug.includes('byd-seagull');
    const isVilla = productSlug.includes('luxury-villa-in-cmc');

    const premiumDescription = isLC300
      ? "🌟 THE ULTIMATE KING OF THE ROAD - TOYOTA LAND CRUISER 300 GR SPORT 🌟\n\nTake command of the Ethiopian terrain with this bulletproof-ready masterpiece. This 2024 model represents the pinnacle of automotive engineering, combining rugged off-road capability with first-class luxury.\n\nKey Features:\n• Engine: 3.5L Twin-Turbo V6 (409 HP) - Unmatched power for high altitudes.\n• Trim: GR Sport Edition with exclusive honeycomb grille and specialized suspension.\n• Interior: Premium 'Sahara Beige' leather, heated/ventilated seats, and 12.3-inch infotainment system.\n• Safety: Toyota Safety Sense 3.0, Multi-Terrain Monitor with 360° cameras.\n• Condition: Brand New, 0km, with full dealership warranty.\n• Location: Available for immediate viewing in Bole, Addis Ababa.\n\nPerfect for diplomatic use, NGO field operations, or luxury personal transport. Serious buyers only. Financing options available."
      : isBYD
        ? "⚡ THE FUTURE IS ELECTRIC - ALL-NEW BYD SEAGULL ⚡\n\nZip through Addis Ababa with style and efficiency. The \"Mini Lamborghini\" of EVs is here, offering unbeatable urban performance and cutting-edge technology.\n\nKey Features:\n• Range: 405km CLTC range on a single charge.\n• Technology: Powered by BYD's ultra-safe Blade Battery technology.\n• Design: Sporty 'Marine Aesthetics' design with sharp LED headlights and aerodynamic lines.\n• Interior: Minimalist two-tone cockpit with a 10.1-inch rotating touchscreen.\n• Economy: Minimum maintenance costs and zero fuel usage.\n• Fast Charging: 30% to 80% charge in just 30 minutes.\n\nAvailable now in exclusive 'Sprout Green'. Ideal for daily commuting and city driving. Be part of the green revolution."
        : isDetailedApt
          ? "💎 EXCLUSIVE BOLE SKYLINE RESIDENCE 💎\n\nElevate your lifestyle in this breathtaking modern apartment located in the prestigious Bole district. Offering a seamless blend of contemporary design and comfort, this residence is the epitome of luxury urban living in Addis Ababa.\n\nKey Highlights:\n• Interior: Open-concept living area with floor-to-ceiling windows and Italian marble flooring.\n• Kitchen: Gourmet chef's kitchen featuring a quartz island and integrated Bosch appliances.\n• Master Suite: Spacious sanctuary with a walk-in closet and spa-inspired en-suite bathroom.\n• View: Stunning panoramic views of the city line and surrounding hills, perfect for sunset relaxation.\n• Amenities: high-speed fiber internet, backup generator, 24/7 security, and dedicated garage parking.\n\nIdeal for expatriates, diplomats, or discerning local families. Move-in ready."
          : isVilla
            ? "🏰 MAJESTIC G+2 LUXURY VILLA IN CMC 🏰\n\nDiscover unparalleled elegance in this expansive family residence situated in the secure and sought-after CMC area. Combining classic architectural charm with modern amenities, this home allows for grand entertaining and private relaxation.\n\nProperty Features:\n• Layout: G+2 structure with 6 bedrooms, 5 bathrooms, and 2 distinct living salons.\n• Compound: 500m² plot featuring a lush manicured garden and traditional coffee ceremony corner.\n• Finishes: Premium natural stone cladding, solid wood cabinetry, and imported ceramic tiles throughout.\n• Extras: Service quarters, 3-car parking capacity, 10,000L water tanker, and 3-phase electricity.\n• Location: Quiet residential street, minutes away from international schools and shopping centers.\n\nA true dream home for a growing family. Title deed clean and transfer-ready."
            : `This is a high-quality ${category.name} listing located in ${location.loc}. High performance, well maintained, and ready for immediate purchase. Built for the Ethiopian market context.`;

    listings.push({
      sellerId: targetSeller.id,
      categoryId: category.id,
      title,
      description: premiumDescription,
      price,
      currency: 'ETB',
      condition: i % 3 === 0 ? 'NEW' : 'USED_GOOD',
      location: location.loc,
      city: location.city,
      images,
      slug: `${title.toLowerCase().replace(/ /g, '-')}-${i}`,
      status: 'ACTIVE',
      negotiable: i % 2 === 0,
      isFeatured: isLC300 || isDetailedApt || isBYD || isVilla || i % 10 === 0,
      isPromoted: i % 15 === 0,
      createdAt: isLC300
        ? new Date()
        : isBYD
          ? new Date(Date.now() - 1000) // 1 second ago
          : isDetailedApt
            ? new Date(Date.now() - 2000) // 2 seconds ago
            : isVilla
              ? new Date(Date.now() - 3000) // 3 seconds ago
              : new Date(Date.now() - 86400000 - Math.floor(Math.random() * 1000000000)), // At least 1 day old
    });
  }

  // Insert in batches of 20 to avoid payload limits if any
  for (let j = 0; j < listings.length; j += 20) {
    await db.insert(schema.listings).values(listings.slice(j, j + 20));
    console.log(`  ✓ Inserted listings ${j + 1} to ${Math.min(j + 20, listings.length)}`);
  }

  console.log('\n✅ Massive Seed Complete!');
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
