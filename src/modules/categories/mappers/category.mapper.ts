import type { CategoryResponseDto } from '@/modules/categories/dtos/category-response.dto.js';
import type { CategoryRecord } from '@/modules/categories/types/category.types.js';

export function toCategoryResponse(category: CategoryRecord): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    created_at: category.created_at,
    updated_at: category.updated_at,
  };
}
