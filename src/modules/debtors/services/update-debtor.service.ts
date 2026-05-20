import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import type { UpdateDebtorDto } from '@/modules/debtors/dtos/update-debtor.dto.js';
import { toDebtorResponse } from '@/modules/debtors/mappers/debtor.mapper.js';
import { findDebtorByIdRepository } from '@/modules/debtors/repositories/find-debtor-by-id.repository.js';
import { updateDebtorRepository } from '@/modules/debtors/repositories/update-debtor.repository.js';

export async function updateDebtorService(id: number, dto: UpdateDebtorDto) {
  const debtor = await findDebtorByIdRepository(id);

  if (!debtor) {
    throw new AppError(404, 'Devedor não encontrado.', ErrorCodes.DEBTOR_NOT_FOUND, 'Não encontrado');
  }

  const updateData: {
    name?: string;
    description?: string;
    amount?: number;
    due_date?: Date;
    status?: string;
    user_id_applicant?: number;
    user_id_owner?: number;
    updated_at: Date;
  } = { updated_at: new Date() };

  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.amount !== undefined) updateData.amount = dto.amount;
  if (dto.due_date !== undefined) updateData.due_date = new Date(dto.due_date);
  if (dto.status !== undefined) updateData.status = dto.status;
  if (dto.user_id_applicant !== undefined) updateData.user_id_applicant = dto.user_id_applicant;
  if (dto.user_id_owner !== undefined) updateData.user_id_owner = dto.user_id_owner;

  const updated = await updateDebtorRepository(id, updateData);
  return toDebtorResponse(updated);
}
