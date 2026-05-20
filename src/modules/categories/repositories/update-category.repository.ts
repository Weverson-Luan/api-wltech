import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';
import type { UpdateCategoryRepositoryInput } from '@/modules/categories/types/category.types.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';

export async function updateCategoryRepository(id: number, input: UpdateCategoryRepositoryInput) {
  await db.update(categories).set(input).where(eq(categories.id, id));

  const category = await findCategoryByIdRepository(id);

  if (!category) {
    throw new Error('Failed to load updated category');
  }

  return category;
}
