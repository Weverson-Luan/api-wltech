import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { debtors } from '@/db/schema/debtors.js';
import type { UpdateDebtorRepositoryInput } from '@/modules/debtors/types/debtor.types.js';
import { findDebtorByIdRepository } from '@/modules/debtors/repositories/find-debtor-by-id.repository.js';

export async function updateDebtorRepository(id: number, input: UpdateDebtorRepositoryInput) {
  await db.update(debtors).set(input).where(eq(debtors.id, id));

  const debtor = await findDebtorByIdRepository(id);

  if (!debtor) {
    throw new Error('Failed to load updated debtor');
  }

  return debtor;
}
