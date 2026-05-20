import { desc } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { categories } from '@/db/schema/categories.js';
import { transactions } from '@/db/schema/transactions.js';
import type { TransactionRecord } from '@/modules/transactions/types/transaction.types.js';
import {
  transactionWithCategorySelect,
  transactionsJoinCategories,
} from '@/modules/transactions/repositories/shared/transaction.select.js';

export async function findAllTransactionsRepository(): Promise<TransactionRecord[]> {
  return db
    .select(transactionWithCategorySelect)
    .from(transactions)
    .innerJoin(categories, transactionsJoinCategories)
    .orderBy(desc(transactions.created_at));
}
