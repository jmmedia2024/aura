import { db } from './index.ts';
import { card_applications, type CardApplication } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function createApplication(data: any) {
  try {
    const result = await db.insert(card_applications).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
}

export async function getApplications() {
  try {
    return await db.select().from(card_applications).orderBy(desc(card_applications.created_at));
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
}

export async function getApplicationsByUser(userId: string) {
  try {
    return await db.select().from(card_applications).where(eq(card_applications.user_id, userId)).orderBy(desc(card_applications.created_at));
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
}

export async function updateApplicationStatus(id: number, status: string) {
  try {
    const result = await db.update(card_applications)
      .set({ status })
      .where(eq(card_applications.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}
