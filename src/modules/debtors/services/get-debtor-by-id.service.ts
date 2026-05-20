import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toDebtorResponse } from '@/modules/debtors/mappers/debtor.mapper.js';
import { findDebtorByIdRepository } from '@/modules/debtors/repositories/find-debtor-by-id.repository.js';

export async function getDebtorByIdService(id: number) {
  const debtor = await findDebtorByIdRepository(id);

  if (!debtor) {
    throw new AppError(404, 'Devedor não encontrado.', ErrorCodes.DEBTOR_NOT_FOUND, 'Não encontrado');
  }

  return toDebtorResponse(debtor);
}
