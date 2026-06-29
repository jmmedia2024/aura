import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || `postgres://${process.env.DB_USER || 'pscale_api_jvlki5oab3y5.9k0005vtdxb5'}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'us-east-1.pg.psdb.cloud'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'postgres'}?sslmode=require`,
  },
});
