import { hash } from 'bcryptjs';
import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { createUserRepository } from '@/modules/users/repositories/create-user.repository.js';
import { findRoleIdByNameRepository } from '@/modules/users/repositories/find-role-id-by-name.repository.js';
import { findUserByEmailRepository } from '@/modules/users/repositories/find-user-by-email.repository.js';
import type { RegisterDto } from '@/modules/auth/dtos/register.dto.js';

const DEFAULT_ROLE = 'user';

export async function registerService(dto: RegisterDto) {
  const existing = await findUserByEmailRepository(dto.email);

  if (existing) {
    throw new AppError(
      409,
      'Este e-mail já está cadastrado.',
      ErrorCodes.EMAIL_ALREADY_EXISTS,
      'E-mail em uso',
    );
  }

  const roleId = await findRoleIdByNameRepository(DEFAULT_ROLE);

  if (!roleId) {
    throw new AppError(
      500,
      'Não foi possível concluir o cadastro. Tente novamente mais tarde.',
      ErrorCodes.DEFAULT_ROLE_NOT_FOUND,
      'Erro interno',
    );
  }

  const password_hash = await hash(dto.password, 10);

  const user = await createUserRepository({
    name: dto.name,
    email: dto.email,
    password_hash,
    role_id: roleId,
  });

  return toUserResponse(user);
}
