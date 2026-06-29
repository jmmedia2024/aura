import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';
import { AsyncLocalStorage } from 'node:async_hooks';

// For local Node.js / Express development:
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/postgres';

// Global pool for Node.js environments
const client = postgres(connectionString);
const defaultDb = drizzle(client, { schema });

export const dbContext = new AsyncLocalStorage<{ db: any, client?: any }>();

export const db = new Proxy({} as any, {
  get(target, prop) {
    const store = dbContext.getStore();
    const activeDb = store?.db || defaultDb;
    const value = activeDb[prop];
    if (typeof value === 'function') {
      return value.bind(activeDb);
    }
    return value;
  }
});

// For Cloudflare Workers + Hyperdrive, connection must be initialized per request
export function createWorkerDb(connectionString: string) {
  const sql = postgres(connectionString);
  return { client: sql, db: drizzle(sql, { schema }) };
}
