import { asc } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';
import type { CategoryRecord } from '@/modules/categories/types/category.types.js';

export async function findAllCategoriesRepository(): Promise<CategoryRecord[]> {
  return db.select().from(categories).orderBy(asc(categories.name));
}
