/**
 * IMPORTS
 */

import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { failForbidden } from '@/lib/errors/http-error.js';
import type { JwtPayload } from '@/types/jwt.js';
import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';

type GetUserByIdInput = {
  id: number;
  requester: JwtPayload;
};

export async function getUserByIdService({ id, requester }: GetUserByIdInput) {
  const isPrivileged = ['admin', 'manager'].includes(requester.role_name);
  const isSelf = requester.sub === id;

  if (!isPrivileged && !isSelf) {
    failForbidden('Você só pode visualizar o seu próprio perfil.');
  }

  const user = await findUserByIdRepository(id);

  if (!user) {
    throw new AppError(404, 'Usuário não encontrado.', ErrorCodes.USER_NOT_FOUND, 'Não encontrado');
  }

  return toUserResponse(user);
}
