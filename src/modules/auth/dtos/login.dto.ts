export type LoginDto = {
  email: string;
  password: string;
};

export type LoginValidationError = {
  field: string;
  message: string;
};

export function validateLoginDto(body: LoginDto): LoginValidationError[] {
  const errors: LoginValidationError[] = [];

  if (!body.email?.trim()) {
    errors.push({ field: 'email', message: 'E-mail é obrigatório.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push({ field: 'email', message: 'E-mail inválido.' });
  }

  if (!body.password) {
    errors.push({ field: 'password', message: 'Senha é obrigatória.' });
  }

  return errors;
}

export function sanitizeLoginDto(body: LoginDto): LoginDto {
  return {
    email: body.email.trim().toLowerCase(),
    password: body.password,
  };
}
