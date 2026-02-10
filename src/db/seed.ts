import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env' });

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('🌱 Seeding database...\n');

  // ─── 1. CREATE ADMIN USER ─────────────────────────
  console.log('Creating users...');
  const [admin] = await db.insert(schema.users).values({
    email: 'admin@sabeh.com',
    name: 'Admin User',
    nameAmharic: 'አስተዳዳሪ',
    phone: '+251911000001',
    password: '$2b$10$placeholder_hash_replace_with_real', // TODO: hash with bcrypt
    role: 'ADMIN',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
  }).onConflictDoNothing().returning();

  const [seller] = await db.insert(schema.users).values({
    email: 'seller@sabeh.com',
    name: 'Test Seller',
    nameAmharic: 'ሻጭ',
    phone: '+251911000002',
    password: '$2b$10$placeholder_hash_replace_with_real',
    role: 'SELLER',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
    responseRate: 95,
    responseTime: 'within 1 hour',
  }).onConflictDoNothing().returning();

  const [buyer] = await db.insert(schema.users).values({
    email: 'buyer@sabeh.com',
    name: 'Test Buyer',
    phone: '+251911000003',
    password: '$2b$10$placeholder_hash_replace_with_real',
    role: 'BUYER',
    isActive: true,
  }).onConflictDoNothing().returning();

  console.log(`  ✓ Created ${[admin, seller, buyer].filter(Boolean).length} users`);

  // ─── 2. CREATE CATEGORIES (Dubizzle-style) ────────
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
    .onConflictDoNothing()
    .returning();

  // Add subcategories for Motors
  const motorsCategory = parentCategories.find(c => c.slug === 'motors');
  if (motorsCategory) {
    await db.insert(schema.categories).values([
      { name: 'Cars for Sale', nameAmharic: 'ለሽያጭ የቀረቡ መኪናዎች', slug: 'cars-for-sale', parentId: motorsCategory.id, sortOrder: 1,
        customFields: [
          { name: 'year', label: 'Year', labelAmharic: 'ዓመት', type: 'number' as const, required: true },
          { name: 'mileage', label: 'Mileage (km)', labelAmharic: 'ኪሎሜትር', type: 'number' as const },
          { name: 'transmission', label: 'Transmission', type: 'select' as const, options: ['Automatic', 'Manual'] },
          { name: 'fuel', label: 'Fuel Type', type: 'select' as const, options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
          { name: 'make', label: 'Make', type: 'text' as const, required: true },
          { name: 'model', label: 'Model', type: 'text' as const, required: true },
        ],
      },
      { name: 'Motorcycles', nameAmharic: 'ሞተርሳይክል', slug: 'motorcycles', parentId: motorsCategory.id, sortOrder: 2 },
      { name: 'Trucks & Heavy Vehicles', nameAmharic: 'ከባድ ተሽከርካሪዎች', slug: 'trucks-heavy', parentId: motorsCategory.id, sortOrder: 3 },
      { name: 'Auto Parts', nameAmharic: 'የመኪና ዕቃዎች', slug: 'auto-parts', parentId: motorsCategory.id, sortOrder: 4 },
    ]).onConflictDoNothing();
  }

  // Add subcategories for Electronics
  const electronicsCategory = parentCategories.find(c => c.slug === 'electronics');
  if (electronicsCategory) {
    await db.insert(schema.categories).values([
      { name: 'Mobile Phones', nameAmharic: 'ሞባይል ስልኮች', slug: 'mobile-phones', parentId: electronicsCategory.id, sortOrder: 1 },
      { name: 'Computers & Laptops', nameAmharic: 'ኮምፒውተሮች', slug: 'computers', parentId: electronicsCategory.id, sortOrder: 2 },
      { name: 'TVs & Audio', nameAmharic: 'ቲቪ እና ኦዲዮ', slug: 'tvs-audio', parentId: electronicsCategory.id, sortOrder: 3 },
      { name: 'Gaming', nameAmharic: 'ጌሚንግ', slug: 'gaming', parentId: electronicsCategory.id, sortOrder: 4 },
    ]).onConflictDoNothing();
  }

  console.log(`  ✓ Created ${parentCategories.length} parent categories + subcategories`);

  // ─── 3. CREATE SAMPLE LISTINGS ────────────────────
  if (seller) {
    console.log('Creating sample listings...');
    const carsCategory = parentCategories.find(c => c.slug === 'motors');
    const phonesCategory = parentCategories.find(c => c.slug === 'electronics');
    const furnitureCategory = parentCategories.find(c => c.slug === 'furniture-home');

    const listingData = [
      {
        sellerId: seller.id,
        title: 'Toyota Corolla 2022 - Excellent Condition',
        titleAmharic: 'ቶዮታ ኮሮላ 2022 - እጅግ ጥሩ ሁኔታ',
        description: 'Well-maintained Toyota Corolla 2022 model. Single owner, full service history. Low mileage, accident-free.',
        price: '2500000',
        currency: 'ETB' as const,
        categoryId: carsCategory?.id || parentCategories[0].id,
        condition: 'LIKE_NEW' as const,
        location: 'Bole, Addis Ababa',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        slug: 'toyota-corolla-2022-' + Date.now(),
        contactPhone: '+251911000002',
        showPhone: true,
        negotiable: true,
        attributes: { year: 2022, mileage: 35000, transmission: 'Automatic', fuel: 'Petrol', make: 'Toyota', model: 'Corolla' },
        status: 'ACTIVE' as const,
      },
      {
        sellerId: seller.id,
        title: 'iPhone 15 Pro Max 256GB',
        description: 'Brand new iPhone 15 Pro Max, sealed in box. 256GB Natural Titanium.',
        price: '85000',
        currency: 'ETB' as const,
        categoryId: phonesCategory?.id || parentCategories[0].id,
        condition: 'NEW' as const,
        location: 'Merkato, Addis Ababa',
        city: 'Addis Ababa',
        slug: 'iphone-15-pro-max-' + Date.now(),
        contactPhone: '+251911000002',
        showPhone: true,
        negotiable: false,
        status: 'ACTIVE' as const,
      },
      {
        sellerId: seller.id,
        title: 'L-Shaped Sofa Set - Italian Leather',
        titleAmharic: 'ኤል ቅርጽ ሶፋ - ጣሊያን ቆዳ',
        description: 'Premium Italian leather L-shaped sofa set. Seats 6 comfortably. Minor wear on armrest.',
        price: '45000',
        currency: 'ETB' as const,
        categoryId: furnitureCategory?.id || parentCategories[0].id,
        condition: 'USED_GOOD' as const,
        location: 'CMC, Addis Ababa',
        city: 'Addis Ababa',
        slug: 'l-shaped-sofa-italian-' + Date.now(),
        contactPhone: '+251911000002',
        showPhone: true,
        negotiable: true,
        status: 'ACTIVE' as const,
      },
      {
        sellerId: seller.id,
        title: 'BYD Seal 2024 - Electric Vehicle',
        titleAmharic: 'BYD Seal 2024 - ኤሌክትሪክ መኪና',
        description: 'Brand new BYD Seal electric sedan. 700km range, fast charging, premium interior. Direct import.',
        price: '4200000',
        currency: 'ETB' as const,
        categoryId: carsCategory?.id || parentCategories[0].id,
        condition: 'NEW' as const,
        location: 'Bole, Addis Ababa',
        city: 'Addis Ababa',
        slug: 'byd-seal-2024-ev-' + Date.now(),
        contactPhone: '+251911000002',
        showPhone: true,
        negotiable: true,
        isFeatured: true,
        isPromoted: true,
        attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuel: 'Electric', make: 'BYD', model: 'Seal' },
        status: 'ACTIVE' as const,
      },
    ];

    await db.insert(schema.listings).values(listingData);
    console.log(`  ✓ Created ${listingData.length} sample listings`);
  }

  // ─── 4. CREATE SAMPLE WAREHOUSE ───────────────────
  console.log('Creating warehouse...');
  await db.insert(schema.warehouses).values({
    name: 'Main Warehouse',
    nameAmharic: 'ዋና መጋዘን',
    code: 'WH-001',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    address: 'Kality Industrial Zone',
    isDefault: true,
    isActive: true,
  }).onConflictDoNothing();
  console.log('  ✓ Created warehouse');

  // ─── 5. APP SETTINGS ─────────────────────────────
  console.log('Creating settings...');
  const settingsData = [
    { key: 'app_name', value: 'Sabeh Importers', description: 'Application name' },
    { key: 'app_name_amharic', value: 'ሳቤ ኢምፖርተርስ', description: 'Amharic app name' },
    { key: 'currency', value: 'ETB', description: 'Default currency' },
    { key: 'tax_rate', value: '15', description: 'VAT rate percentage' },
    { key: 'listing_expiry_days', value: '30', description: 'Days before a listing expires' },
    { key: 'max_images_per_listing', value: '10', description: 'Max images per listing' },
  ];

  await db.insert(schema.settings).values(settingsData).onConflictDoNothing();
  console.log(`  ✓ Created ${settingsData.length} settings`);

  console.log('\n✅ Seed complete!\n');
  console.log('Test accounts:');
  console.log('  Admin:  admin@sabeh.com');
  console.log('  Seller: seller@sabeh.com');
  console.log('  Buyer:  buyer@sabeh.com');
  console.log('  Password: (update with bcrypt hash)\n');

  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
