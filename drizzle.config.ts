import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL is missing.\n' +
    'Add it to your .env file:\n' +
    'DATABASE_URL="postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require"\n' +
    'Get your URL from: https://console.neon.tech'
  );
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // Show verbose output during migrations
  verbose: true,
  // Strict mode prevents accidental data loss
  strict: true,
});
