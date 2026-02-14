
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import { listings } from './schema';
import { desc, eq, and } from 'drizzle-orm';

dotenv.config({ path: '.env' });

async function verify() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: { listings } });

  console.log('Verifying listings in database...');

  const results = await db.select()
    .from(listings)
    .where(eq(listings.status, 'ACTIVE'))
    .orderBy(desc(listings.createdAt))
    .limit(10);

  console.log('Top 10 Active Listings (Newest First):');
  results.forEach((l, i) => {
    console.log(`${i + 1}. [${l.isFeatured ? 'FEATURED' : 'STANDARD'}] ${l.title} - CreatedAt: ${l.createdAt}`);
  });

  const lc300 = results.find(l => l.title.includes('Land Cruiser 300'));
  const apt = results.find(l => l.title.includes('Modern Luxury Apartment'));

  if (lc300 && lc300.isFeatured) {
    console.log('✅ Toyota Land Cruiser 300 is FOUND and FEATURED.');
  } else {
    console.log('❌ Toyota Land Cruiser 300 is MISSING or NOT FEATURED.');
  }

  if (apt && apt.isFeatured) {
    console.log('✅ Modern Luxury Apartment is FOUND and FEATURED.');
  } else {
    console.log('❌ Modern Luxury Apartment is MISSING or NOT FEATURED.');
  }

  await pool.end();
}

verify().catch(console.error);
