import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

const host = process.env.DB_HOST || 'us-east-1.pg.psdb.cloud';
const port = process.env.DB_PORT || '5432';
const database = process.env.DB_NAME || 'postgres';
const user = process.env.DB_USER || 'pscale_api_jvlki5oab3y5.9k0005vtdxb5';
const password = process.env.DB_PASSWORD;

const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/postgres`;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
