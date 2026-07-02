import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.ts';
import { AsyncLocalStorage } from 'node:async_hooks';

// Function to create a new connection pool.
export const createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
  });
};

// Create a pool instance.
const pool = createPool();

// Prevent unhandled pool-level errors from crashing the application
pool.on('error', (err) => {
  console.error('Unexpected error on idle SQL pool client:', err);
});

// Initialize Drizzle with the pool and schema.
const defaultDb = drizzle(pool, { schema });

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
