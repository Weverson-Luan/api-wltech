import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';
import type { CreateCategoryRepositoryInput } from '@/modules/categories/types/category.types.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';

export async function createCategoryRepository(input: CreateCategoryRepositoryInput) {
  const [created] = await db
    .insert(categories)
    .values(input)
    .returning({ id: categories.id });

  const category = await findCategoryByIdRepository(created.id);

  if (!category) {
    throw new Error('Failed to load created category');
  }

  return category;
}
