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

  console.log('🌱 Seeding database with Sabeh Importers + 100 listings...\n');

  // Pre-hash passwords (cost=10 is fast enough for seeding)
  const [adminHash, sellerHash, buyerHash, seller2Hash, sabehHash] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('seller123', 10),
    bcrypt.hash('buyer123', 10),
    bcrypt.hash('mekdes2024', 10),
    bcrypt.hash('sabeh2024', 10),
  ]);
  console.log('✓ Passwords hashed');
  console.log('  admin@sabeh.com              → admin123');
  console.log('  seller@sabeh.com             → seller123');
  console.log('  buyer@sabeh.com              → buyer123');
  console.log('  mekdes@sabeh.com             → mekdes2024  (registered seller)');
  console.log('  info@sabehimporters.com      → sabeh2024   (Sabeh Importers)\n');

  // Clear existing data (order matters due to FKs)
  console.log('Cleaning existing data...');
  await db.delete(schema.messages);
  await db.delete(schema.conversations);
  await db.delete(schema.reviews);
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

  const [buyer] = await db.insert(schema.users).values({
    email: 'buyer@sabeh.com',
    name: 'Hagos Belay',
    phone: '+251911556677',
    password: buyerHash,
    role: 'BUYER',
    isActive: true,
    isEmailVerified: true,
  }).returning();

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

  // ─── Sabeh Importers (first customer company) ──────────────────
  const [sabehImporters] = await db.insert(schema.users).values({
    email: 'info@sabehimporters.com',
    name: 'Sabeh Importers',
    nameAmharic: 'ሳቤህ ኢምፖርተርስ',
    phone: '+251911999888',
    password: sabehHash,
    role: 'SELLER',
    isActive: true,
    isEmailVerified: true,
    verificationStatus: 'VERIFIED',
    companyName: 'Sabeh Importers PLC',
    companyNameAmharic: 'ሳቤህ ኢምፖርተርስ ኃ.የተ.የግ.ማ',
    businessLicense: 'ET/BL/2024/00789',
    tinNumber: '0098765432',
    website: 'https://sabehimporters.com',
    companyDescription: 'Leading import company in Ethiopia specializing in vehicles, industrial equipment, and commercial electronics. Authorized dealer for Toyota, BYD, and Caterpillar. Serving businesses and individuals across East Africa since 2018.',
    coverImage: 'https://picsum.photos/seed/sabeh-cover/1200/400',
    responseRate: 99,
    responseTime: 'under 30 mins',
    bio: 'Authorized importer of vehicles, machinery & electronics. Trusted by 500+ businesses nationwide.',
  }).returning();
  console.log('  ✓ Sabeh Importers company created');

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

  // Helper to find category by slug
  const catBySlug = (slug: string) => parentCategories.find(c => c.slug === slug)!;

  // ─── 3. SABEH IMPORTERS LISTINGS (18 realistic items) ──────────
  console.log('Creating Sabeh Importers listings...');

  const sabehListings = [
    // Motors (8)
    {
      title: '2024 Toyota Land Cruiser 300 GR Sport',
      description: 'Brand new 2024 Toyota Land Cruiser 300 GR Sport. 3.5L Twin-Turbo V6, 409 HP. Full dealership warranty. Perfect for diplomatic use or luxury personal transport. Imported directly from Japan with full customs clearance.\n\nFeatures:\n- GR Sport exclusive honeycomb grille\n- Premium leather heated/ventilated seats\n- 12.3-inch infotainment with Apple CarPlay\n- Toyota Safety Sense 3.0\n- Multi-Terrain Monitor with 360-degree cameras\n- 0 km, brand new condition',
      price: '18500000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-lc300/800/600'],
      isFeatured: true,
      isPromoted: true,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Diesel' },
    },
    {
      title: '2024 Toyota Hilux Double Cab 4x4',
      description: 'Brand new Toyota Hilux 2.8L Diesel Double Cab, 4WD. The workhorse of East Africa, now available for immediate delivery. Full manufacturer warranty included.\n\nSpecifications:\n- 2.8L Turbo Diesel, 204 HP\n- 6-speed automatic transmission\n- 4x4 with rear diff lock\n- LED headlights, 18-inch alloys\n- Tow capacity: 3,500 kg\n- Available in White Pearl and Attitude Black',
      price: '7200000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-hilux/800/600'],
      isFeatured: true,
      isPromoted: false,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Diesel' },
    },
    {
      title: 'BYD Seal EV - Premium Electric Sedan',
      description: 'All-new BYD Seal electric sedan. Blade Battery technology for maximum safety. 700km CLTC range. Fast charging 30-80% in 26 minutes.\n\nHighlights:\n- Dual motor AWD, 530 HP\n- 0-100 km/h in 3.8 seconds\n- 15.6-inch rotating touchscreen\n- Intelligent driving assistance\n- 5-year/150,000 km warranty\n- Exclusive Cosmos Black color',
      price: '5400000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-byd-seal/800/600'],
      isFeatured: true,
      isPromoted: false,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Electric' },
    },
    {
      title: 'BYD Seagull - Affordable Urban EV',
      description: 'The city-friendly BYD Seagull EV. 405km range on a single charge. Ultra-safe Blade Battery. Perfect for Addis Ababa daily commuting.\n\nFeatures:\n- 10.1-inch rotating touchscreen\n- Marine Aesthetics sporty design\n- Fast charging support\n- Minimal maintenance costs\n- Available in Sprout Green and Sky Blue',
      price: '2800000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-byd-seagull/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Electric' },
    },
    {
      title: '2023 Toyota Coaster Bus 30-Seater',
      description: 'Toyota Coaster bus, ideal for staff transport, tourism, or institutional use. Diesel engine, manual transmission. Full customs clearance completed.\n\nSpecifications:\n- 4.2L Diesel engine\n- 30 passenger seats with seatbelts\n- Air conditioning\n- Power steering\n- Low km, excellent condition',
      price: '9500000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Kality, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-coaster/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { year: 2023, mileage: 0, transmission: 'Manual', fuelType: 'Diesel' },
    },
    {
      title: 'Toyota Forklift 3-Ton Diesel',
      description: 'Heavy-duty Toyota forklift for warehouse and logistics operations. 3-ton lifting capacity. Proven reliability for Ethiopian business conditions.\n\nSpecs:\n- 3,000 kg lift capacity\n- Diesel powered\n- Mast height: 4.5m\n- Side shift included\n- 1-year parts warranty',
      price: '3200000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Kality, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-forklift/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Diesel' },
    },
    {
      title: '2024 Toyota HiAce Cargo Van',
      description: 'Brand new Toyota HiAce panel van for commercial delivery and logistics. 2.8L Turbo Diesel. Spacious cargo area.\n\nFeatures:\n- 2.8L Diesel, 176 HP\n- 6-speed automatic\n- Cargo volume: 6.2 m3\n- Payload: 1,275 kg\n- Rear sliding door\n- Available in White',
      price: '5800000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-hiace/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Diesel' },
    },
    {
      title: '2024 Toyota Land Cruiser Prado TX',
      description: 'New generation Land Cruiser Prado TX. Perfect balance of luxury and off-road capability. Ideal for Ethiopian roads.\n\nHighlights:\n- 2.8L Diesel Turbo, 204 HP\n- Full-time 4WD\n- 9.0-inch touchscreen\n- 7-seat configuration\n- Kinetic Dynamic Suspension\n- Full customs clearance',
      price: '12000000',
      categorySlug: 'motors',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-prado/800/600'],
      isFeatured: true,
      isPromoted: true,
      attributes: { year: 2024, mileage: 0, transmission: 'Automatic', fuelType: 'Diesel' },
    },
    // Industrial Equipment (5)
    {
      title: 'Caterpillar CAT D6 Bulldozer',
      description: 'Caterpillar D6 bulldozer for construction and mining projects. Low-hour machine, imported with full documentation.\n\nSpecifications:\n- Engine: Cat C9.3B, 215 HP\n- Operating weight: 22,000 kg\n- Blade capacity: 3.9 m3\n- GPS-ready\n- Air-conditioned cab\n- Full service history available',
      price: '28000000',
      categorySlug: 'industrial-equipment',
      condition: 'USED_GOOD' as const,
      location: 'Kality, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-cat-d6/800/600'],
      isFeatured: true,
      isPromoted: false,
      attributes: { year: 2022, hours: 1200 },
    },
    {
      title: 'Perkins 500 kVA Diesel Generator',
      description: 'Perkins-powered 500 kVA standby generator. Perfect for factories, hotels, and large commercial buildings. Automatic transfer switch included.\n\nSpecifications:\n- Prime power: 450 kVA / 360 kW\n- Standby: 500 kVA / 400 kW\n- Perkins 2506C-E15TAG2 engine\n- Automatic voltage regulation\n- Sound-attenuated enclosure\n- Fuel tank: 1,000 liters\n- 2-year warranty',
      price: '4500000',
      categorySlug: 'industrial-equipment',
      condition: 'NEW' as const,
      location: 'Kality, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-generator/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { power: '500 kVA', fuelType: 'Diesel' },
    },
    {
      title: 'Concrete Mixer Truck 8m3 - Sinotruk',
      description: 'Sinotruk HOWO concrete mixer truck. 8 cubic meter drum capacity. Ready for construction site delivery.\n\nSpecs:\n- Drum capacity: 8 m3\n- Engine: 371 HP\n- 6x4 drive configuration\n- Discharge speed: 3-5 m3/min\n- Air brake system\n- 1-year powertrain warranty',
      price: '8500000',
      categorySlug: 'industrial-equipment',
      condition: 'NEW' as const,
      location: 'Kality, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-mixer/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { capacity: '8 m3' },
    },
    {
      title: 'Industrial Welding Machine - Lincoln 500A',
      description: 'Lincoln Electric 500 Amp MIG/MAG welding machine. Professional grade for heavy fabrication and construction.\n\nFeatures:\n- 500A output at 100% duty cycle\n- MIG/MAG and stick welding\n- Digital display\n- Wire feeder included\n- Industrial cart\n- 3-year warranty',
      price: '850000',
      categorySlug: 'industrial-equipment',
      condition: 'NEW' as const,
      location: 'Merkato, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-welder/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: {},
    },
    {
      title: 'Komatsu PC200 Excavator',
      description: 'Komatsu PC200-8 hydraulic excavator. Versatile machine for construction, mining, and earthmoving projects.\n\nSpecifications:\n- Engine: 155 HP Komatsu SAA6D107E\n- Operating weight: 20,300 kg\n- Bucket capacity: 0.8 m3\n- Max dig depth: 6.7 m\n- Air-conditioned ROPS cab\n- Low hours, well maintained',
      price: '22000000',
      categorySlug: 'industrial-equipment',
      condition: 'USED_GOOD' as const,
      location: 'Kality, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-excavator/800/600'],
      isFeatured: false,
      isPromoted: true,
      attributes: { year: 2021, hours: 2500 },
    },
    // Electronics (5)
    {
      title: 'Samsung 75" Commercial Display - QM75B',
      description: 'Samsung 75-inch commercial-grade display for hotels, offices, and retail. 4K UHD resolution with built-in Tizen OS.\n\nFeatures:\n- 4K UHD (3840x2160)\n- 500 nit brightness\n- 24/7 operation rated\n- Built-in media player\n- HDMI, USB, LAN connectivity\n- 3-year commercial warranty',
      price: '320000',
      categorySlug: 'electronics',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-samsung-display/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { brand: 'Samsung', screenSize: '75 inch' },
    },
    {
      title: 'Hikvision 16-Channel CCTV System',
      description: 'Complete Hikvision 16-channel security camera system. 4MP resolution with night vision. Ideal for businesses and warehouses.\n\nIncludes:\n- 16-channel NVR (4TB HDD)\n- 16x 4MP IP cameras\n- PoE switch\n- All cabling and connectors\n- Professional installation available\n- 2-year warranty',
      price: '185000',
      categorySlug: 'electronics',
      condition: 'NEW' as const,
      location: 'Merkato, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-cctv/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { brand: 'Hikvision', channels: 16 },
    },
    {
      title: 'Epson L15150 A3+ EcoTank Printer',
      description: 'Epson EcoTank L15150 all-in-one printer. A3+ printing, scanning, copying, and fax. Ultra-low running costs with refillable ink tanks.\n\nFeatures:\n- A3+ printing capability\n- Duplex printing\n- Wi-Fi and Ethernet\n- 25 ppm black, 12 ppm color\n- ADF for scanning\n- Ink included for up to 7,500 pages',
      price: '95000',
      categorySlug: 'electronics',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-printer/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { brand: 'Epson' },
    },
    {
      title: 'Dell PowerEdge R750 Server',
      description: 'Enterprise-grade Dell PowerEdge R750 rack server. Ideal for data centers, ERP systems, and cloud infrastructure.\n\nConfiguration:\n- 2x Intel Xeon Gold 5318Y (24C/48T)\n- 128GB DDR4 RAM\n- 4x 2.4TB SAS SSD (RAID 10)\n- Dual 800W PSU\n- iDRAC9 Enterprise\n- 3-year ProSupport warranty',
      price: '650000',
      categorySlug: 'electronics',
      condition: 'NEW' as const,
      location: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-server/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { brand: 'Dell' },
    },
    {
      title: 'Motorola DP4801e Two-Way Radio (10-Pack)',
      description: 'Motorola DP4801e professional digital two-way radios. Pack of 10 units for fleet, security, or construction teams.\n\nFeatures per unit:\n- IP68 dust/water rated\n- GPS enabled\n- Bluetooth audio\n- 32-channel capacity\n- 12-hour battery life\n- Noise cancellation\n- Chargers and earpieces included',
      price: '420000',
      categorySlug: 'electronics',
      condition: 'NEW' as const,
      location: 'Merkato, Addis Ababa',
      city: 'Addis Ababa',
      images: ['https://picsum.photos/seed/si-radio/800/600'],
      isFeatured: false,
      isPromoted: false,
      attributes: { brand: 'Motorola', quantity: 10 },
    },
  ];

  const insertedSabehListings: any[] = [];
  for (const item of sabehListings) {
    const cat = catBySlug(item.categorySlug);
    const [inserted] = await db.insert(schema.listings).values({
      sellerId: sabehImporters.id,
      categoryId: cat.id,
      title: item.title,
      description: item.description,
      price: item.price,
      currency: 'ETB',
      condition: item.condition,
      location: item.location,
      city: item.city,
      images: item.images,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      status: 'ACTIVE',
      negotiable: true,
      isFeatured: item.isFeatured,
      isPromoted: item.isPromoted,
      attributes: item.attributes,
      contactPhone: '+251911999888',
      contactWhatsapp: '+251911999888',
      showPhone: true,
      viewCount: Math.floor(Math.random() * 500) + 50,
      favoriteCount: Math.floor(Math.random() * 30),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)), // within last 7 days
    }).returning();
    insertedSabehListings.push(inserted);
  }
  console.log(`  ✓ Inserted ${insertedSabehListings.length} Sabeh Importers listings`);

  // ─── REVIEWS for Sabeh Importers ──────────────────
  console.log('Creating reviews for Sabeh Importers...');
  await db.insert(schema.reviews).values([
    {
      reviewerId: buyer.id,
      revieweeId: sabehImporters.id,
      listingId: insertedSabehListings[0].id, // LC300
      rating: 5,
      title: 'Excellent service and genuine product',
      comment: 'Purchased a Land Cruiser 300 from Sabeh Importers. The entire process was smooth - from initial inquiry to delivery. Vehicle came exactly as described with full warranty documentation. Highly recommend for anyone looking to import vehicles.',
      isVerifiedPurchase: true,
    },
    {
      reviewerId: buyer.id,
      revieweeId: sabehImporters.id,
      listingId: insertedSabehListings[9].id, // generator
      rating: 4,
      title: 'Good generator, reliable seller',
      comment: 'Bought a Perkins generator for our factory. Good quality product and reasonable pricing. Delivery took a bit longer than expected but the team was communicative throughout. Will buy from them again.',
      isVerifiedPurchase: true,
    },
    {
      reviewerId: buyer.id,
      revieweeId: sabehImporters.id,
      listingId: insertedSabehListings[1].id, // Hilux
      rating: 5,
      title: 'Best importer in Addis',
      comment: 'This is our third vehicle purchase from Sabeh Importers. Always professional, always on time. The Hilux is perfect for our field operations. Their after-sales support is top-notch too.',
      isVerifiedPurchase: true,
    },
  ]);
  console.log('  ✓ 3 reviews created');

  // ─── CONVERSATION between buyer and Sabeh Importers ─────
  console.log('Creating sample conversation...');
  const [conversation] = await db.insert(schema.conversations).values({
    listingId: insertedSabehListings[0].id, // LC300
    buyerId: buyer.id,
    sellerId: sabehImporters.id,
    lastMessageAt: new Date(),
    buyerUnread: 1,
    sellerUnread: 0,
  }).returning();

  await db.insert(schema.messages).values([
    {
      conversationId: conversation.id,
      senderId: buyer.id,
      content: 'Hi, is the Land Cruiser 300 still available? I am interested in purchasing for our company fleet.',
      type: 'TEXT',
      isRead: true,
      readAt: new Date(Date.now() - 3600000),
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      conversationId: conversation.id,
      senderId: sabehImporters.id,
      content: 'Hello! Yes, the LC300 GR Sport is available for immediate delivery. We have both Sahara Beige and Black interiors in stock. Would you like to schedule a viewing at our Bole showroom?',
      type: 'TEXT',
      isRead: true,
      readAt: new Date(Date.now() - 1800000),
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      conversationId: conversation.id,
      senderId: buyer.id,
      content: 'Great! We need 2 units for our fleet. Is there a discount for bulk purchase? Also, do you handle customs clearance?',
      type: 'TEXT',
      isRead: true,
      readAt: new Date(Date.now() - 900000),
      createdAt: new Date(Date.now() - 1800000),
    },
    {
      conversationId: conversation.id,
      senderId: sabehImporters.id,
      content: 'Absolutely! For 2+ units we offer corporate pricing. All our vehicles come with full customs clearance - that is included in the listed price. I will send you a formal quotation via email. What is the best email address to reach you?',
      type: 'TEXT',
      isRead: false,
      createdAt: new Date(Date.now() - 600000),
    },
  ]);
  console.log('  ✓ Sample conversation created');

  // ─── 4. PREPARE ASSETS ────────────────────────────
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

  // ─── 5. GENERATE 100 LISTINGS (from existing sellers) ──────────
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
      const isLC300 = i === 10;
      const isBYD = i === 20;

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
      const isDetailedApt = i === 1;
      const isVilla = i === 11;

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

    // Check if we have a detailed asset set for this product title
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
      ? "THE ULTIMATE KING OF THE ROAD - TOYOTA LAND CRUISER 300 GR SPORT\n\nTake command of the Ethiopian terrain with this bulletproof-ready masterpiece. This 2024 model represents the pinnacle of automotive engineering, combining rugged off-road capability with first-class luxury.\n\nKey Features:\n- Engine: 3.5L Twin-Turbo V6 (409 HP) - Unmatched power for high altitudes.\n- Trim: GR Sport Edition with exclusive honeycomb grille and specialized suspension.\n- Interior: Premium 'Sahara Beige' leather, heated/ventilated seats, and 12.3-inch infotainment system.\n- Safety: Toyota Safety Sense 3.0, Multi-Terrain Monitor with 360-degree cameras.\n- Condition: Brand New, 0km, with full dealership warranty.\n- Location: Available for immediate viewing in Bole, Addis Ababa.\n\nPerfect for diplomatic use, NGO field operations, or luxury personal transport. Serious buyers only. Financing options available."
      : isBYD
        ? "THE FUTURE IS ELECTRIC - ALL-NEW BYD SEAGULL\n\nZip through Addis Ababa with style and efficiency. The affordable EV is here, offering unbeatable urban performance and cutting-edge technology.\n\nKey Features:\n- Range: 405km CLTC range on a single charge.\n- Technology: Powered by BYD's ultra-safe Blade Battery technology.\n- Design: Sporty 'Marine Aesthetics' design with sharp LED headlights and aerodynamic lines.\n- Interior: Minimalist two-tone cockpit with a 10.1-inch rotating touchscreen.\n- Economy: Minimum maintenance costs and zero fuel usage.\n- Fast Charging: 30% to 80% charge in just 30 minutes.\n\nAvailable now in exclusive 'Sprout Green'. Ideal for daily commuting and city driving. Be part of the green revolution."
        : isDetailedApt
          ? "EXCLUSIVE BOLE SKYLINE RESIDENCE\n\nElevate your lifestyle in this breathtaking modern apartment located in the prestigious Bole district. Offering a seamless blend of contemporary design and comfort, this residence is the epitome of luxury urban living in Addis Ababa.\n\nKey Highlights:\n- Interior: Open-concept living area with floor-to-ceiling windows and Italian marble flooring.\n- Kitchen: Gourmet chef's kitchen featuring a quartz island and integrated Bosch appliances.\n- Master Suite: Spacious sanctuary with a walk-in closet and spa-inspired en-suite bathroom.\n- View: Stunning panoramic views of the city line and surrounding hills, perfect for sunset relaxation.\n- Amenities: high-speed fiber internet, backup generator, 24/7 security, and dedicated garage parking.\n\nIdeal for expatriates, diplomats, or discerning local families. Move-in ready."
          : isVilla
            ? "MAJESTIC G+2 LUXURY VILLA IN CMC\n\nDiscover unparalleled elegance in this expansive family residence situated in the secure and sought-after CMC area. Combining classic architectural charm with modern amenities, this home allows for grand entertaining and private relaxation.\n\nProperty Features:\n- Layout: G+2 structure with 6 bedrooms, 5 bathrooms, and 2 distinct living salons.\n- Compound: 500m2 plot featuring a lush manicured garden and traditional coffee ceremony corner.\n- Finishes: Premium natural stone cladding, solid wood cabinetry, and imported ceramic tiles throughout.\n- Extras: Service quarters, 3-car parking capacity, 10,000L water tanker, and 3-phase electricity.\n- Location: Quiet residential street, minutes away from international schools and shopping centers.\n\nA true dream home for a growing family. Title deed clean and transfer-ready."
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
          ? new Date(Date.now() - 1000)
          : isDetailedApt
            ? new Date(Date.now() - 2000)
            : isVilla
              ? new Date(Date.now() - 3000)
              : new Date(Date.now() - 86400000 - Math.floor(Math.random() * 1000000000)),
    });
  }

  // Insert in batches of 20
  for (let j = 0; j < listings.length; j += 20) {
    await db.insert(schema.listings).values(listings.slice(j, j + 20));
    console.log(`  ✓ Inserted listings ${j + 1} to ${Math.min(j + 20, listings.length)}`);
  }

  console.log('\n✅ Seed Complete! (Sabeh Importers + 100 marketplace listings)');
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
