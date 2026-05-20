import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';
import type { CategoryRecord } from '@/modules/categories/types/category.types.js';

export async function findCategoryByIdRepository(id: number): Promise<CategoryRecord | null> {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ?? null;
}
