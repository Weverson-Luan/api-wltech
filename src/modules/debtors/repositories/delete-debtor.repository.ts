import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { debtors } from '@/db/schema/debtors.js';

export async function deleteDebtorRepository(id: number): Promise<boolean> {
  const result = await db.delete(debtors).where(eq(debtors.id, id)).returning({ id: debtors.id });
  return result.length > 0;
}
