import { compare } from 'bcryptjs';
import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { findUserByEmailRepository } from '@/modules/users/repositories/find-user-by-email.repository.js';
import type { LoginDto } from '@/modules/auth/dtos/login.dto.js';

export async function loginService(dto: LoginDto) {
  const user = await findUserByEmailRepository(dto.email);

  if (!user) {
    throw new AppError(
      401,
      'E-mail ou senha inválidos.',
      ErrorCodes.INVALID_CREDENTIALS,
      'Credenciais inválidas',
    );
  }

  const passwordMatches = await compare(dto.password, user.password_hash);

  if (!passwordMatches) {
    throw new AppError(
      401,
      'E-mail ou senha inválidos.',
      ErrorCodes.INVALID_CREDENTIALS,
      'Credenciais inválidas',
    );
  }

  return toUserResponse(user);
}
