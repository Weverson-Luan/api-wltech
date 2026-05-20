export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type RegisterValidationError = {
  field: string;
  message: string;
};

export function validateRegisterDto(body: RegisterDto): RegisterValidationError[] {
  const errors: RegisterValidationError[] = [];

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

  return errors;
}

export function sanitizeRegisterDto(body: RegisterDto): RegisterDto {
  return {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: body.password,
  };
}
