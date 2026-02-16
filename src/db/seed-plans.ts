import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env' });

async function seedPlans() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('🌱 Seeding plans...');

  const plans = [
    {
      id: 'plan_free',
      name: 'Free',
      nameAmharic: 'ነጻ',
      slug: 'free',
      price: '0',
      currency: 'ETB',
      durationDays: 30,
      maxActiveListings: 1,
      canPromote: false,
      canFeature: false,
      sortOrder: 1,
    },
    {
      id: 'plan_pro',
      name: 'Standard',
      nameAmharic: 'መደበኛ',
      slug: 'standard',
      price: '500',
      currency: 'ETB',
      durationDays: 60,
      maxActiveListings: 5,
      canPromote: true,
      canFeature: true,
      sortOrder: 2,
    },
    {
      id: 'plan_business',
      name: 'Premium',
      nameAmharic: 'ፕሪሚየም',
      slug: 'premium',
      price: '2000',
      currency: 'ETB',
      durationDays: 90,
      maxActiveListings: 100,
      canPromote: true,
      canFeature: true,
      sortOrder: 3,
    },
  ];

  for (const plan of plans) {
    // Upsert plans
    await db.insert(schema.plans).values(plan as any).onConflictDoUpdate({
      target: schema.plans.id,
      set: plan as any,
    });
    console.log(`  ✓ Upserted plan: ${plan.name}`);
  }

  console.log('✅ Plans seeding complete!');
  await pool.end();
}

seedPlans().catch((err) => {
  console.error('❌ Plan seeding failed:', err);
  process.exit(1);
});
