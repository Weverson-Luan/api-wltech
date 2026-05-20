import type { DebtorResponseDto } from '@/modules/debtors/dtos/debtor-response.dto.js';
import type { DebtorRecord } from '@/modules/debtors/types/debtor.types.js';

export function toDebtorResponse(debtor: DebtorRecord): DebtorResponseDto {
  return {
    id: debtor.id,
    name: debtor.name,
    description: debtor.description,
    amount: debtor.amount,
    due_date: debtor.due_date,
    status: debtor.status,
    user_id_applicant: debtor.user_id_applicant,
    user_id_owner: debtor.user_id_owner,
    created_at: debtor.created_at,
    updated_at: debtor.updated_at,
  };
}
