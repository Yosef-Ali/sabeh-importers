import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { desc } from 'drizzle-orm';

dotenv.config({ path: '.env' });

async function verifyData() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('🔍 Verifying database data...\n');

  // Count users
  const users = await db.select().from(schema.users);
  console.log(`✓ Users: ${users.length}`);
  users.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role}`));

  // Count categories
  const categories = await db.select().from(schema.categories);
  console.log(`\n✓ Categories: ${categories.length}`);
  categories.forEach(c => console.log(`  - ${c.name} (${c.slug})`));

  // Count listings
  const listings = await db.select().from(schema.listings);
  console.log(`\n✓ Total Listings: ${listings.length}`);

  // Count by status
  const activeListings = listings.filter(l => l.status === 'ACTIVE');
  const featuredListings = listings.filter(l => l.isFeatured);
  console.log(`  - Active: ${activeListings.length}`);
  console.log(`  - Featured: ${featuredListings.length}`);

  // Show first 5 listings
  console.log('\n📋 First 5 Listings:');
  const first5 = await db.query.listings.findMany({
    limit: 5,
    orderBy: [desc(schema.listings.createdAt)],
    with: {
      seller: {
        columns: {
          name: true,
          email: true,
        },
      },
      category: {
        columns: {
          name: true,
        },
      },
    },
  });

  first5.forEach((l, i) => {
    console.log(`\n${i + 1}. ${l.title}`);
    console.log(`   Category: ${l.category?.name || 'N/A'}`);
    console.log(`   Seller: ${l.seller?.name || 'N/A'}`);
    console.log(`   Price: ${l.price} ${l.currency}`);
    console.log(`   Status: ${l.status}`);
    console.log(`   Featured: ${l.isFeatured ? 'Yes' : 'No'}`);
    console.log(`   Images: ${l.images?.length || 0}`);
  });

  await pool.end();
}

verifyData().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
