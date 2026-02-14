import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

const globalForDb = globalThis as unknown as {
  db: NeonHttpDatabase<typeof schema> | undefined;
};

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url && process.env.NODE_ENV === 'production') {
    // During build, we might not have the URL. Use a placeholder to avoid neon() throwing.
    return drizzle(neon("postgresql://db:db@localhost:5432/db") as any, { schema });
  }
  const sql = neon(url!);
  return drizzle(sql, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
