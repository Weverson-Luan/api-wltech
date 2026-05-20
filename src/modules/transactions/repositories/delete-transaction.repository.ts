import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { transactions } from '@/db/schema/transactions.js';

export async function deleteTransactionRepository(id: number): Promise<boolean> {
  const result = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning({ id: transactions.id });
  return result.length > 0;
}
