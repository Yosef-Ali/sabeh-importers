import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Fix for custom Neon hostname format
neonConfig.fetchEndpoint = (host) => {
  const protocol = host === 'localhost' ? 'http' : 'https';
  return `${protocol}://${host}/sql`;
};

const globalForDb = globalThis as unknown as {
  db: NeonHttpDatabase<typeof schema> | undefined;
};

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add it to your Vercel project settings: ' +
      'https://vercel.com/docs/environment-variables'
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

// Use a lazy proxy so that neon() is NOT called at build time.
// The real DB connection is created on the first property access at runtime.
function createLazyDb(): NeonHttpDatabase<typeof schema> {
  let instance: NeonHttpDatabase<typeof schema> | null = null;

  return new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_target, prop, receiver) {
      if (!instance) {
        instance = createDb();
        // Cache for dev hot-reloads
        if (process.env.NODE_ENV !== 'production') {
          globalForDb.db = instance;
        }
      }
      return Reflect.get(instance, prop, receiver);
    },
  });
}

export const db = globalForDb.db ?? createLazyDb();
