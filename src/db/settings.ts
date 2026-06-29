import { db } from './index.ts';
import { app_settings } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string) {
  try {
    const result = await db.select().from(app_settings).where(eq(app_settings.key, key)).limit(1);
    return result[0]?.value || null;
  } catch (error) {
    console.error("Error getting setting:", error);
    return null;
  }
}

export async function getAllSettings() {
  try {
    const results = await db.select().from(app_settings);
    return results.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
}

export async function upsertSetting(key: string, value: any) {
  try {
    const existing = await db.select().from(app_settings).where(eq(app_settings.key, key)).limit(1);
    if (existing.length > 0) {
      const result = await db.update(app_settings)
        .set({ value, updated_at: new Date() })
        .where(eq(app_settings.key, key))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(app_settings).values({ key, value }).returning();
      return result[0];
    }
  } catch (error) {
    console.error("Error upserting setting:", error);
    throw error;
  }
}
