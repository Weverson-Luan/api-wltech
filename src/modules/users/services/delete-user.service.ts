import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { failForbidden } from '@/lib/errors/http-error.js';
import type { JwtPayload } from '@/types/jwt.js';
import { deleteUserRepository } from '@/modules/users/repositories/delete-user.repository.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';

type DeleteUserInput = {
  id: number;
  requester: JwtPayload;
};

export async function deleteUserService({ id, requester }: DeleteUserInput) {
  if (requester.sub === id) {
    failForbidden('Você não pode excluir a sua própria conta.');
  }

  const user = await findUserByIdRepository(id);

  if (!user) {
    throw new AppError(404, 'Usuário não encontrado.', ErrorCodes.USER_NOT_FOUND, 'Não encontrado');
  }

  const deleted = await deleteUserRepository(id);

  if (!deleted) {
    throw new AppError(
      500,
      'Não foi possível excluir o usuário.',
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno',
    );
  }

  return { id, deleted: true };
}
