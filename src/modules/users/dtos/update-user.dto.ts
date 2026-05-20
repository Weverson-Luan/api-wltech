export type UpdateUserDto = {
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
};

export type UpdateUserValidationError = {
  field: string;
  message: string;
};

export function validateUpdateUserDto(body: UpdateUserDto): UpdateUserValidationError[] {
  const errors: UpdateUserValidationError[] = [];
  const hasAnyField =
    body.name !== undefined ||
    body.email !== undefined ||
    body.password !== undefined ||
    body.role_id !== undefined;

  if (!hasAnyField) {
    errors.push({
      field: 'body',
      message: 'Informe ao menos um campo para atualizar.',
    });
    return errors;
  }

  if (body.name !== undefined && body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (body.email !== undefined) {
    if (!body.email.trim()) {
      errors.push({ field: 'email', message: 'E-mail é obrigatório.' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({ field: 'email', message: 'E-mail inválido.' });
    }
  }

  if (body.password !== undefined && body.password.length < 6) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  if (body.role_id !== undefined && Number.isNaN(Number(body.role_id))) {
    errors.push({ field: 'role_id', message: 'Role inválida.' });
  }

  return errors;
}

export function sanitizeUpdateUserDto(body: UpdateUserDto): UpdateUserDto {
  const sanitized: UpdateUserDto = {};

  if (body.name !== undefined) sanitized.name = body.name.trim();
  if (body.email !== undefined) sanitized.email = body.email.trim().toLowerCase();
  if (body.password !== undefined) sanitized.password = body.password;
  if (body.role_id !== undefined) sanitized.role_id = Number(body.role_id);

  return sanitized;
}
