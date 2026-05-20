import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import type { UpdateCategoryDto } from '@/modules/categories/dtos/update-category.dto.js';
import { toCategoryResponse } from '@/modules/categories/mappers/category.mapper.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';
import { findCategoryByNameRepository } from '@/modules/categories/repositories/find-category-by-name.repository.js';
import { updateCategoryRepository } from '@/modules/categories/repositories/update-category.repository.js';

export async function updateCategoryService(id: number, dto: UpdateCategoryDto) {
  const category = await findCategoryByIdRepository(id);

  if (!category) {
    throw new AppError(404, 'Categoria não encontrada.', ErrorCodes.CATEGORY_NOT_FOUND, 'Não encontrado');
  }

  if (dto.name !== undefined && dto.name !== category.name) {
    const existing = await findCategoryByNameRepository(dto.name);

    if (existing) {
      throw new AppError(
        409,
        'Já existe uma categoria com este nome.',
        ErrorCodes.CATEGORY_ALREADY_EXISTS,
        'Conflito',
      );
    }
  }

  const updateData: { name?: string; description?: string; updated_at: Date } = {
    updated_at: new Date(),
  };

  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.description !== undefined) updateData.description = dto.description;

  const updated = await updateCategoryRepository(id, updateData);
  return toCategoryResponse(updated);
}
