import { db } from './index.ts';
import { card_designs } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getCardDesigns() {
  try {
    return await db.select().from(card_designs);
  } catch (error) {
    return [];
  }
}

export async function upsertCardDesign(data: any) {
  try {
    if (data.id) {
      // Try update first
      const result = await db.update(card_designs)
        .set(data)
        .where(eq(card_designs.id, data.id))
        .returning();
      
      if (result.length > 0) {
        return result[0];
      }
      
      // If it doesn't exist, fall through to insert
    }
    
    // Insert new record (with or without id, db handles it)
    const result = await db.insert(card_designs).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("Error upserting card design:", error);
    throw error;
  }
}

export async function deleteCardDesign(id: string) {
  try {
    await db.delete(card_designs).where(eq(card_designs.id, id));
  } catch (error) {
    console.error("Error deleting card design:", error);
    throw error;
  }
}
