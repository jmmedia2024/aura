import { db } from './index.ts';
import { profiles, type Profile } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getProfile(id: string) {
  try {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
}

export async function getOrCreateProfile(id: string, email: string) {
  try {
    const existing = await getProfile(id);
    if (existing) return existing;

    const isDefaultAdmin = email === 'new2020.jeonil@gmail.com' || email === 'nkjoy@fandomaurora.com';
    const newProfile: any = {
      id,
      email,
      display_name: isDefaultAdmin ? 'nkjoy (관리자)' : 'Fan',
      tier: isDefaultAdmin ? 'Legend Tier' : 'Basic',
      role: isDefaultAdmin ? 'Admin' : 'User',
      ancestors: []
    };

    const result = await db.insert(profiles).values(newProfile).returning();
    return result[0];
  } catch (error) {
    console.error("Error creating profile:", error);
    const isDefaultAdmin = email === 'new2020.jeonil@gmail.com' || email === 'nkjoy@fandomaurora.com';
    return {
      id,
      email,
      display_name: isDefaultAdmin ? 'nkjoy (관리자)' : 'Fan',
      tier: isDefaultAdmin ? 'Legend Tier' : 'Basic',
      role: isDefaultAdmin ? 'Admin' : 'User',
      ancestors: []
    };
  }
}

export async function updateProfile(id: string, data: Partial<Profile>) {
  try {
    const result = await db.update(profiles)
      .set(data)
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
