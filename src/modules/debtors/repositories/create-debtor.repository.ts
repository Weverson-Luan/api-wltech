import { db } from '@/db/index.js';
import { debtors } from '@/db/schema/debtors.js';
import type { CreateDebtorRepositoryInput } from '@/modules/debtors/types/debtor.types.js';
import { findDebtorByIdRepository } from '@/modules/debtors/repositories/find-debtor-by-id.repository.js';

export async function createDebtorRepository(input: CreateDebtorRepositoryInput) {
  const [created] = await db
    .insert(debtors)
    .values(input)
    .returning({ id: debtors.id });

  const debtor = await findDebtorByIdRepository(created.id);

  if (!debtor) {
    throw new Error('Failed to load created debtor');
  }

  return debtor;
}
