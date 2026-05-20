import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toTransactionResponse } from '@/modules/transactions/mappers/transaction.mapper.js';
import { findTransactionByIdRepository } from '@/modules/transactions/repositories/find-transaction-by-id.repository.js';

export async function getTransactionByIdService(id: number) {
  const transaction = await findTransactionByIdRepository(id);

  if (!transaction) {
    throw new AppError(
      404,
      'Transação não encontrada.',
      ErrorCodes.TRANSACTION_NOT_FOUND,
      'Não encontrado',
    );
  }

  return toTransactionResponse(transaction);
}
