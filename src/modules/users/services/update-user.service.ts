/**
 * IMPORTS
 */

import { hash } from 'bcryptjs';
import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { failForbidden } from '@/lib/errors/http-error.js';
import type { JwtPayload } from '@/types/jwt.js';
import type { UpdateUserDto } from '@/modules/users/dtos/update-user.dto.js';
import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { findRoleByIdRepository } from '@/modules/users/repositories/find-role-by-id.repository.js';
import { findUserByEmailRepository } from '@/modules/users/repositories/find-user-by-email.repository.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';
import { updateUserRepository } from '@/modules/users/repositories/update-user.repository.js';

type UpdateUserInput = {
  id: number;
  dto: UpdateUserDto;
  requester: JwtPayload;
};

export async function updateUserService({ id, dto, requester }: UpdateUserInput) {
  const isAdmin = requester.role_name === 'admin';
  const isSelf = requester.sub === id;

  if (!isAdmin && !isSelf) {
    failForbidden('Você só pode atualizar o seu próprio perfil.');
  }

  if (!isAdmin && dto.role_id !== undefined) {
    failForbidden('Apenas administradores podem alterar a role do usuário.');
  }

  const user = await findUserByIdRepository(id);

  if (!user) {
    throw new AppError(404, 'Usuário não encontrado.', ErrorCodes.USER_NOT_FOUND, 'Não encontrado');
  }

  if (dto.email && dto.email !== user.email) {
    const emailInUse = await findUserByEmailRepository(dto.email);
    if (emailInUse && emailInUse.id !== id) {
      throw new AppError(
        409,
        'Este e-mail já está cadastrado.',
        ErrorCodes.EMAIL_ALREADY_EXISTS,
        'E-mail em uso',
      );
    }
  }

  if (dto.role_id !== undefined) {
    const role = await findRoleByIdRepository(dto.role_id);
    if (!role) {
      throw new AppError(400, 'Role informada não existe.', ErrorCodes.VALIDATION_ERROR, 'Dados inválidos', [
        { field: 'role_id', message: 'Role informada não existe.' },
      ]);
    }
  }

  const updateData: {
    name?: string;
    email?: string;
    password_hash?: string;
    role_id?: number;
    updated_at: Date;
  } = { updated_at: new Date() };

  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.email !== undefined) updateData.email = dto.email;
  if (dto.role_id !== undefined) updateData.role_id = dto.role_id;
  if (dto.password !== undefined) updateData.password_hash = await hash(dto.password, 10);

  const updated = await updateUserRepository(id, updateData);
  return toUserResponse(updated);
}
