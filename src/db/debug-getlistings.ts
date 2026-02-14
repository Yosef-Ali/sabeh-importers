
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { getListings } from '../lib/actions/marketplace';

dotenv.config({ path: '.env' });

async function debug() {
  console.log('Debugging getListings server action...');

  const featured = await getListings({ featured: true, limit: 10 });
  console.log('Featured Listings Count:', featured.data.length);
  featured.data.forEach((l, i) => {
    console.log(`${i + 1}. ${l.title} (Status: ${l.status}, Featured: ${l.isFeatured})`);
  });

  const all = await getListings({ limit: 10 });
  console.log('\nRecent Listings Count:', all.data.length);
  all.data.forEach((l, i) => {
    console.log(`${i + 1}. ${l.title} (Status: ${l.status}, CreatedAt: ${l.createdAt})`);
  });
}

debug().catch(console.error);
