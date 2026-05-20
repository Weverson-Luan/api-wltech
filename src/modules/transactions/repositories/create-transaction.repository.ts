import { db } from '@/db/index.js';
import { transactions } from '@/db/schema/transactions.js';
import type { CreateTransactionRepositoryInput } from '@/modules/transactions/types/transaction.types.js';
import { findTransactionByIdRepository } from '@/modules/transactions/repositories/find-transaction-by-id.repository.js';

export async function createTransactionRepository(input: CreateTransactionRepositoryInput) {
  const [created] = await db
    .insert(transactions)
    .values(input)
    .returning({ id: transactions.id });

  const transaction = await findTransactionByIdRepository(created.id);

  if (!transaction) {
    throw new Error('Failed to load created transaction');
  }

  return transaction;
}
