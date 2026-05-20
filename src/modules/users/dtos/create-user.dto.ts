export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role_id: number;
};

export type CreateUserValidationError = {
  field: string;
  message: string;
};

export function validateCreateUserDto(body: CreateUserDto): CreateUserValidationError[] {
  const errors: CreateUserValidationError[] = [];

  if (!body.name?.trim() || body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (!body.email?.trim()) {
    errors.push({ field: 'email', message: 'E-mail é obrigatório.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push({ field: 'email', message: 'E-mail inválido.' });
  }

  if (!body.password || body.password.length < 6) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  if (!body.role_id || Number.isNaN(Number(body.role_id))) {
    errors.push({ field: 'role_id', message: 'Role é obrigatória.' });
  }

  return errors;
}

export function sanitizeCreateUserDto(body: CreateUserDto): CreateUserDto {
  return {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: body.password,
    role_id: Number(body.role_id),
  };
}
