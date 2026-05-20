import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';
import { transactions } from '@/db/schema/transactions.js';
import type { TransactionRecord } from '@/modules/transactions/types/transaction.types.js';
import {
  transactionWithCategorySelect,
  transactionsJoinCategories,
} from '@/modules/transactions/repositories/shared/transaction.select.js';

export async function findTransactionByIdRepository(id: number): Promise<TransactionRecord | null> {
  const [row] = await db
    .select(transactionWithCategorySelect)
    .from(transactions)
    .innerJoin(categories, transactionsJoinCategories)
    .where(eq(transactions.id, id))
    .limit(1);

  return row ?? null;
}
