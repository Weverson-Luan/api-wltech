import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import type { CreateCategoryDto } from '@/modules/categories/dtos/create-category.dto.js';
import { toCategoryResponse } from '@/modules/categories/mappers/category.mapper.js';
import { createCategoryRepository } from '@/modules/categories/repositories/create-category.repository.js';
import { findCategoryByNameRepository } from '@/modules/categories/repositories/find-category-by-name.repository.js';

export async function createCategoryService(dto: CreateCategoryDto) {
  const existing = await findCategoryByNameRepository(dto.name);

  if (existing) {
    throw new AppError(
      409,
      'Já existe uma categoria com este nome.',
      ErrorCodes.CATEGORY_ALREADY_EXISTS,
      'Conflito',
    );
  }

  const category = await createCategoryRepository({
    name: dto.name,
    description: dto.description,
  });

  return toCategoryResponse(category);
}
