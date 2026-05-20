import { toCategoryResponse } from '@/modules/categories/mappers/category.mapper.js';
import { findAllCategoriesRepository } from '@/modules/categories/repositories/find-all-categories.repository.js';

export async function listCategoriesService() {
  const categories = await findAllCategoriesRepository();
  return categories.map(toCategoryResponse);
}
