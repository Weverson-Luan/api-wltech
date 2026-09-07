import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { debtors } from '@/db/schema/debtors.js';
import type { DebtorRecord } from '@/modules/debtors/types/debtor.types.js';

export async function findDebtorByUuidRepository(uuid: string): Promise<DebtorRecord | null> {
  const [row] = await db.select().from(debtors).where(eq(debtors.uuid, uuid)).limit(1);
  return row ?? null;
}
