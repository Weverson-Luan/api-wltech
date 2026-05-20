import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toCategoryResponse } from '@/modules/categories/mappers/category.mapper.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';

export async function getCategoryByIdService(id: number) {
  const category = await findCategoryByIdRepository(id);

  if (!category) {
    throw new AppError(404, 'Categoria não encontrada.', ErrorCodes.CATEGORY_NOT_FOUND, 'Não encontrado');
  }

  return toCategoryResponse(category);
}
