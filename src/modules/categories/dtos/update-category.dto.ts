export type UpdateCategoryDto = {
  name?: string;
  description?: string;
};

export type UpdateCategoryValidationError = {
  field: string;
  message: string;
};

export function validateUpdateCategoryDto(body: UpdateCategoryDto): UpdateCategoryValidationError[] {
  const errors: UpdateCategoryValidationError[] = [];
  const hasAnyField = body.name !== undefined || body.description !== undefined;

  if (!hasAnyField) {
    errors.push({ field: 'body', message: 'Informe ao menos um campo para atualizar.' });
    return errors;
  }

  if (body.name !== undefined && body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (body.description !== undefined && !body.description.trim()) {
    errors.push({ field: 'description', message: 'Descrição não pode ser vazia.' });
  }

  return errors;
}

export function sanitizeUpdateCategoryDto(body: UpdateCategoryDto): UpdateCategoryDto {
  const sanitized: UpdateCategoryDto = {};

  if (body.name !== undefined) sanitized.name = body.name.trim();
  if (body.description !== undefined) sanitized.description = body.description.trim();

  return sanitized;
}
