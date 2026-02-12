import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

dotenv.config({ path: '.env' });

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('🌱 Seeding database with 100 Ethiopian-focused listings...\n');

  // Clear existing data (optional, but good for a fresh start in development)
  // console.log('Cleaning existing data...');
  // await db.delete(schema.listings);

  // ─── 1. CREATE USERS ──────────────────────────────
  console.log('Creating users...');

  let [admin] = await db.insert(schema.users).values({
    email: 'admin@sabeh.com',
    name: 'Admin User',
    nameAmharic: 'አስተዳዳሪ',
    phone: '+251911000001',
    password: '$2b$10$placeholder_hash_replace_with_real',
    role: 'ADMIN',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
  }).onConflictDoNothing().returning();

  if (!admin) {
    [admin] = await db.select().from(schema.users).where(eq(schema.users.email, 'admin@sabeh.com')).limit(1);
  }

  let [seller] = await db.insert(schema.users).values({
    email: 'seller@sabeh.com',
    name: 'Yosef Ali',
    nameAmharic: 'ዮሴፍ አሊ',
    phone: '+251911223344',
    password: '$2b$10$placeholder_hash_replace_with_real',
    role: 'SELLER',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
    responseRate: 98,
    responseTime: 'under 15 mins',
  }).onConflictDoNothing().returning();

  if (!seller) {
    [seller] = await db.select().from(schema.users).where(eq(schema.users.email, 'seller@sabeh.com')).limit(1);
  }

  let [buyer] = await db.insert(schema.users).values({
    email: 'buyer@sabeh.com',
    name: 'Hagos Belay',
    phone: '+251911556677',
    password: '$2b$10$placeholder_hash_replace_with_real',
    role: 'BUYER',
    isActive: true,
  }).onConflictDoNothing().returning();

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

  let parentCategories = await db.insert(schema.categories)
    .values(categoryData)
    .onConflictDoNothing()
    .returning();

  if (parentCategories.length === 0) {
    parentCategories = await db.select().from(schema.categories);
  }

  // ─── 3. PREPARE ASSETS ────────────────────────────
  const motorImages = [
    '/images/products/motors/mercedes-c-class.png',
    '/images/products/motors/land-cruiser.png',
    '/images/products/motors/kia-sportage.png',
    '/images/products/motors/vespa.png',
    '/images/products/motors/bajaj-re.png',
    '/images/products/motors/isuzu-truck.png',
    '/images/products/motors/hyundai-elantra.png',
    '/images/products/motors/ford-raptor.png',
    '/images/products/toyota-corolla.png',
    '/images/products/byd-seal.png',
  ];

  const propertyImages = [
    '/images/products/property/luxury-apartment.png',
    '/images/products/property/modern-villa.png',
  ];


  const genericImages = [
    '/images/products/iphone-15.png',
    '/images/products/leather-sofa.png',
  ];

  // Map of specific product titles (slug-like) to high-quality image arrays (5 images each)
  const detailedProductAssets: Record<string, string[]> = {
    'luxury-villa': [
      '/images/products/property/luxury-villa/exterior.png',
      '/images/products/property/luxury-villa/living-room.png',
      '/images/products/property/luxury-villa/bedroom.png',
      '/images/products/property/luxury-villa/kitchen.png',
      '/images/products/property/luxury-villa/pool.png',
    ],
    // Future detailed products can be added here
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
    const location = locations[i % locations.length];

    let images: string[] = [];
    let title = '';
    let price = '1000';

    if (category.slug === 'motors') {
      images = [motorImages[i % motorImages.length]];
      const brands = ['Toyota', 'Hyundai', 'Mercedes', 'Suzuki', 'Kia', 'Lifan'];
      const brand = brands[i % brands.length];
      title = `${brand} ${i % 2 === 0 ? 'Sedan' : 'SUV'} - 202${i % 5} Model`;
      price = (Math.floor(Math.random() * 5000000) + 500000).toString();
    } else if (category.slug === 'property') {
      const isVilla = i % 2 !== 0;
      title = `${isVilla ? 'Luxury Villa' : 'Modern Apartment'} in ${location.loc}`;
      price = (Math.floor(Math.random() * 20000000) + 2000000).toString();

      // Default placeholder images
      images = [propertyImages[i % propertyImages.length]];
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

    listings.push({
      sellerId: targetSeller.id,
      categoryId: category.id,
      title,
      description: `This is a high-quality ${category.name} listing located in ${location.loc}. High performance, well maintained, and ready for immediate purchase. Built for the Ethiopian market context.`,
      price,
      currency: 'ETB',
      condition: i % 3 === 0 ? 'NEW' : 'USED_GOOD',
      location: location.loc,
      city: location.city,
      images,
      slug: `${title.toLowerCase().replace(/ /g, '-')}-${Date.now()}-${i}`,
      status: 'ACTIVE',
      negotiable: i % 2 === 0,
      isFeatured: i % 10 === 0,
      isPromoted: i % 15 === 0,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
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
