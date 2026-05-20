import { desc } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { debtors } from '@/db/schema/debtors.js';
import type { DebtorRecord } from '@/modules/debtors/types/debtor.types.js';

export async function findAllDebtorsRepository(): Promise<DebtorRecord[]> {
  return db.select().from(debtors).orderBy(desc(debtors.created_at));
}
