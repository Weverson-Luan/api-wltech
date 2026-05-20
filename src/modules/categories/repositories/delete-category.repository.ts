import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';

export async function deleteCategoryRepository(id: number): Promise<boolean> {
  const result = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
  return result.length > 0;
}
