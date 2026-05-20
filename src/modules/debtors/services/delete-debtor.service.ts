import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { deleteDebtorRepository } from '@/modules/debtors/repositories/delete-debtor.repository.js';
import { findDebtorByIdRepository } from '@/modules/debtors/repositories/find-debtor-by-id.repository.js';

export async function deleteDebtorService(id: number) {
  const debtor = await findDebtorByIdRepository(id);

  if (!debtor) {
    throw new AppError(404, 'Devedor não encontrado.', ErrorCodes.DEBTOR_NOT_FOUND, 'Não encontrado');
  }

  const deleted = await deleteDebtorRepository(id);

  if (!deleted) {
    throw new AppError(
      500,
      'Não foi possível excluir o devedor.',
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno',
    );
  }

  return { id, deleted: true };
}
