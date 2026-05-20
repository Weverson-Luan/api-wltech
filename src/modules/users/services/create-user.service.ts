/**
 * IMPORTS
 */

import { hash } from 'bcryptjs';
import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import type { CreateUserDto } from '@/modules/users/dtos/create-user.dto.js';
import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { createUserRepository } from '@/modules/users/repositories/create-user.repository.js';
import { findRoleByIdRepository } from '@/modules/users/repositories/find-role-by-id.repository.js';
import { findUserByEmailRepository } from '@/modules/users/repositories/find-user-by-email.repository.js';

export async function createUserService(dto: CreateUserDto) {
  const existing = await findUserByEmailRepository(dto.email);

  if (existing) {
    throw new AppError(
      409,
      'Este e-mail já está cadastrado.',
      ErrorCodes.EMAIL_ALREADY_EXISTS,
      'E-mail em uso',
    );
  }

  const role = await findRoleByIdRepository(dto.role_id);

  if (!role) {
    throw new AppError(400, 'Role informada não existe.', ErrorCodes.VALIDATION_ERROR, 'Dados inválidos', [
      { field: 'role_id', message: 'Role informada não existe.' },
    ]);
  }

  const password_hash = await hash(dto.password, 10);

  const user = await createUserRepository({
    name: dto.name,
    email: dto.email,
    password_hash,
    role_id: dto.role_id,
  });

  return toUserResponse(user);
}
