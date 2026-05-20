import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { transactions } from '@/db/schema/transactions.js';
import type { UpdateTransactionRepositoryInput } from '@/modules/transactions/types/transaction.types.js';
import { findTransactionByIdRepository } from '@/modules/transactions/repositories/find-transaction-by-id.repository.js';

export async function updateTransactionRepository(id: number, input: UpdateTransactionRepositoryInput) {
  await db.update(transactions).set(input).where(eq(transactions.id, id));

  const transaction = await findTransactionByIdRepository(id);

  if (!transaction) {
    throw new Error('Failed to load updated transaction');
  }

  return transaction;
}
