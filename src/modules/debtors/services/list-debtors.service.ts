import { toDebtorResponse } from '@/modules/debtors/mappers/debtor.mapper.js';
import { findAllDebtorsRepository } from '@/modules/debtors/repositories/find-all-debtors.repository.js';

export async function listDebtorsService() {
  const debtors = await findAllDebtorsRepository();
  return debtors.map(toDebtorResponse);
}
