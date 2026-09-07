import type { CreateDebtorDto } from '@/modules/debtors/dtos/create-debtor.dto.js';
import { toDebtorResponse } from '@/modules/debtors/mappers/debtor.mapper.js';
import { createDebtorRepository } from '@/modules/debtors/repositories/create-debtor.repository.js';

export async function createDebtorService(dto: CreateDebtorDto) {
  const debtor = await createDebtorRepository({
    name: dto.name,
    description: dto.description,
    amount: dto.amount,
    principal_amount: dto.principal_amount,
    due_date: new Date(dto.due_date),
    status: dto.status,
    user_id_applicant: dto.user_id_applicant,
    user_id_owner: dto.user_id_owner,
  });

  return toDebtorResponse(debtor);
}
