import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';

export async function meService(userId: number) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError(
      404,
      'Usuário não encontrado.',
      ErrorCodes.USER_NOT_FOUND,
      'Não encontrado',
    );
  }

  return toUserResponse(user);
}
