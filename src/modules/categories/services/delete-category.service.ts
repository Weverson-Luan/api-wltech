import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { deleteCategoryRepository } from '@/modules/categories/repositories/delete-category.repository.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';

export async function deleteCategoryService(id: number) {
  const category = await findCategoryByIdRepository(id);

  if (!category) {
    throw new AppError(404, 'Categoria não encontrada.', ErrorCodes.CATEGORY_NOT_FOUND, 'Não encontrado');
  }

  const deleted = await deleteCategoryRepository(id);

  if (!deleted) {
    throw new AppError(
      500,
      'Não foi possível excluir a categoria.',
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno',
    );
  }

  return { id, deleted: true };
}
