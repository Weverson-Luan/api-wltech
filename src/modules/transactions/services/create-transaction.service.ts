import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';
import type { CreateTransactionDto } from '@/modules/transactions/dtos/create-transaction.dto.js';
import { toTransactionResponse } from '@/modules/transactions/mappers/transaction.mapper.js';
import { createTransactionRepository } from '@/modules/transactions/repositories/create-transaction.repository.js';

export async function createTransactionService(dto: CreateTransactionDto) {
  const category = await findCategoryByIdRepository(dto.category_id);

  if (!category) {
    throw new AppError(404, 'Categoria não encontrada.', ErrorCodes.CATEGORY_NOT_FOUND, 'Não encontrado');
  }

  const transaction = await createTransactionRepository({
    user_id: dto.user_id,
    type: dto.type,
    amount: dto.amount,
    category_id: dto.category_id,
    payment_method: dto.payment_method,
    date: new Date(dto.date),
  });

  return toTransactionResponse(transaction);
}
