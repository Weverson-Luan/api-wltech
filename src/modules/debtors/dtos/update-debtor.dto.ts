import { isValidDebtorStatus, normalizeDebtorStatus, validateDebtorStatus } from '@/modules/debtors/lib/status.js';

export type UpdateDebtorDto = {
  name?: string;
  description?: string;
  amount?: number;
  due_date?: string;
  status?: string;
  user_id_applicant?: number;
  user_id_owner?: number;
};

export type UpdateDebtorValidationError = {
  field: string;
  message: string;
};

export function validateUpdateDebtorDto(body: UpdateDebtorDto): UpdateDebtorValidationError[] {
  const errors: UpdateDebtorValidationError[] = [];
  const hasAnyField =
    body.name !== undefined ||
    body.description !== undefined ||
    body.amount !== undefined ||
    body.due_date !== undefined ||
    body.status !== undefined ||
    body.user_id_applicant !== undefined ||
    body.user_id_owner !== undefined;

  if (!hasAnyField) {
    errors.push({ field: 'body', message: 'Informe ao menos um campo para atualizar.' });
    return errors;
  }

  if (body.name !== undefined && body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (body.description !== undefined && !body.description.trim()) {
    errors.push({ field: 'description', message: 'Descrição não pode ser vazia.' });
  }

  if (body.amount !== undefined) {
    if (Number.isNaN(Number(body.amount))) {
      errors.push({ field: 'amount', message: 'Valor deve ser numérico.' });
    } else if (Number(body.amount) <= 0) {
      errors.push({ field: 'amount', message: 'Valor deve ser maior que zero.' });
    }
  }

  if (body.due_date !== undefined) {
    if (!body.due_date.trim()) {
      errors.push({ field: 'due_date', message: 'Data de vencimento não pode ser vazia.' });
    } else if (Number.isNaN(Date.parse(body.due_date))) {
      errors.push({ field: 'due_date', message: 'Data de vencimento inválida.' });
    }
  }

  if (body.status !== undefined) {
    const statusResult = validateDebtorStatus(body.status);
    if (!statusResult.valid) {
      errors.push({ field: 'status', message: statusResult.message });
    }
  }

  if (body.user_id_applicant !== undefined) {
    if (!Number.isInteger(Number(body.user_id_applicant)) || Number(body.user_id_applicant) <= 0) {
      errors.push({ field: 'user_id_applicant', message: 'ID do solicitante inválido.' });
    }
  }

  if (body.user_id_owner !== undefined) {
    if (!Number.isInteger(Number(body.user_id_owner)) || Number(body.user_id_owner) <= 0) {
      errors.push({ field: 'user_id_owner', message: 'ID do proprietário inválido.' });
    }
  }

  return errors;
}

export function sanitizeUpdateDebtorDto(body: UpdateDebtorDto): UpdateDebtorDto {
  const sanitized: UpdateDebtorDto = {};

  if (body.name !== undefined) sanitized.name = body.name.trim();
  if (body.description !== undefined) sanitized.description = body.description.trim();
  if (body.amount !== undefined) sanitized.amount = Number(body.amount);
  if (body.due_date !== undefined) sanitized.due_date = body.due_date.trim();
  if (body.status !== undefined) {
    sanitized.status = isValidDebtorStatus(body.status.trim().toLowerCase())
      ? normalizeDebtorStatus(body.status)
      : body.status.trim().toLowerCase();
  }
  if (body.user_id_applicant !== undefined) sanitized.user_id_applicant = Number(body.user_id_applicant);
  if (body.user_id_owner !== undefined) sanitized.user_id_owner = Number(body.user_id_owner);

  return sanitized;
}
