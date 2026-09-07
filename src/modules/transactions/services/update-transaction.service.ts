import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { findCategoryByIdRepository } from '@/modules/categories/repositories/find-category-by-id.repository.js';
import type { UpdateTransactionDto } from '@/modules/transactions/dtos/update-transaction.dto.js';
import { toTransactionResponse } from '@/modules/transactions/mappers/transaction.mapper.js';
import { findTransactionByIdRepository } from '@/modules/transactions/repositories/find-transaction-by-id.repository.js';
import { updateTransactionRepository } from '@/modules/transactions/repositories/update-transaction.repository.js';

export async function updateTransactionService(id: number, dto: UpdateTransactionDto) {
  const transaction = await findTransactionByIdRepository(id);

  if (!transaction) {
    throw new AppError(
      404,
      'Transação não encontrada.',
      ErrorCodes.TRANSACTION_NOT_FOUND,
      'Não encontrado',
    );
  }

  if (dto.category_id !== undefined) {
    const category = await findCategoryByIdRepository(dto.category_id);

    if (!category) {
      throw new AppError(404, 'Categoria não encontrada.', ErrorCodes.CATEGORY_NOT_FOUND, 'Não encontrado');
    }
  }

  const updateData: {
    user_id?: number;
    type?: string;
    amount?: number;
    category_id?: number;
    payment_method?: string;
    description?: string;
    notes?: string | null;
    date?: Date;
    updated_at: Date;
  } = { updated_at: new Date() };

  if (dto.user_id !== undefined) updateData.user_id = dto.user_id;
  if (dto.type !== undefined) updateData.type = dto.type;
  if (dto.amount !== undefined) updateData.amount = dto.amount;
  if (dto.category_id !== undefined) updateData.category_id = dto.category_id;
  if (dto.payment_method !== undefined) updateData.payment_method = dto.payment_method;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.notes !== undefined) updateData.notes = dto.notes;
  if (dto.date !== undefined) updateData.date = new Date(dto.date);

  const updated = await updateTransactionRepository(id, updateData);
  return toTransactionResponse(updated);
}
