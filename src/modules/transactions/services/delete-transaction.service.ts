import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { deleteTransactionRepository } from '@/modules/transactions/repositories/delete-transaction.repository.js';
import { findTransactionByIdRepository } from '@/modules/transactions/repositories/find-transaction-by-id.repository.js';

export async function deleteTransactionService(id: number) {
  const transaction = await findTransactionByIdRepository(id);

  if (!transaction) {
    throw new AppError(
      404,
      'Transação não encontrada.',
      ErrorCodes.TRANSACTION_NOT_FOUND,
      'Não encontrado',
    );
  }

  const deleted = await deleteTransactionRepository(id);

  if (!deleted) {
    throw new AppError(
      500,
      'Não foi possível excluir a transação.',
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno',
    );
  }

  return { id, deleted: true };
}
