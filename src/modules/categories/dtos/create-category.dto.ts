export type CreateCategoryDto = {
  name: string;
  description: string;
};

export type CreateCategoryValidationError = {
  field: string;
  message: string;
};

export function validateCreateCategoryDto(body: CreateCategoryDto): CreateCategoryValidationError[] {
  const errors: CreateCategoryValidationError[] = [];

  if (!body.name?.trim() || body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (!body.description?.trim()) {
    errors.push({ field: 'description', message: 'Descrição é obrigatória.' });
  }

  return errors;
}

export function sanitizeCreateCategoryDto(body: CreateCategoryDto): CreateCategoryDto {
  return {
    name: body.name.trim(),
    description: body.description.trim(),
  };
}
