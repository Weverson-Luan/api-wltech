import { isValidDebtorStatus, normalizeDebtorStatus, validateDebtorStatus } from '@/modules/debtors/lib/status.js';

export type CreateDebtorDto = {
  uuid?: string;
  name: string;
  description: string;
  amount: number;
  principal_amount: number;
  due_date: string;
  status: string;
  user_id_applicant: number;
  user_id_owner: number;
};

export type CreateDebtorValidationError = {
  field: string;
  message: string;
};

export function validateCreateDebtorDto(body: CreateDebtorDto): CreateDebtorValidationError[] {
  const errors: CreateDebtorValidationError[] = [];

  if (!body.name?.trim() || body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (!body.description?.trim()) {
    errors.push({ field: 'description', message: 'Descrição é obrigatória.' });
  }

  if (body.amount === undefined || body.amount === null || Number.isNaN(Number(body.amount))) {
    errors.push({ field: 'amount', message: 'Valor é obrigatório e deve ser numérico.' });
  } else if (Number(body.amount) <= 0) {
    errors.push({ field: 'amount', message: 'Valor deve ser maior que zero.' });
  }

  if (
    body.principal_amount === undefined ||
    body.principal_amount === null ||
    Number.isNaN(Number(body.principal_amount))
  ) {
    errors.push({ field: 'principal_amount', message: 'Valor pego é obrigatório e deve ser numérico.' });
  } else if (Number(body.principal_amount) <= 0) {
    errors.push({ field: 'principal_amount', message: 'Valor pego deve ser maior que zero.' });
  }

  if (
    body.amount !== undefined &&
    body.amount !== null &&
    body.principal_amount !== undefined &&
    body.principal_amount !== null &&
    !Number.isNaN(Number(body.amount)) &&
    !Number.isNaN(Number(body.principal_amount)) &&
    Number(body.amount) < Number(body.principal_amount)
  ) {
    errors.push({
      field: 'amount',
      message: 'Valor a ser pago deve ser maior ou igual ao valor pego.',
    });
  }

  if (!body.due_date?.trim()) {
    errors.push({ field: 'due_date', message: 'Data de vencimento é obrigatória.' });
  } else if (Number.isNaN(Date.parse(body.due_date))) {
    errors.push({ field: 'due_date', message: 'Data de vencimento inválida.' });
  }

  const statusResult = validateDebtorStatus(body.status);
  if (!statusResult.valid) {
    errors.push({ field: 'status', message: statusResult.message });
  }

  if (
    body.user_id_applicant === undefined ||
    body.user_id_applicant === null ||
    !Number.isInteger(Number(body.user_id_applicant)) ||
    Number(body.user_id_applicant) <= 0
  ) {
    errors.push({ field: 'user_id_applicant', message: 'ID do solicitante é obrigatório.' });
  }

  if (
    body.user_id_owner === undefined ||
    body.user_id_owner === null ||
    !Number.isInteger(Number(body.user_id_owner)) ||
    Number(body.user_id_owner) <= 0
  ) {
    errors.push({ field: 'user_id_owner', message: 'ID do proprietário é obrigatório.' });
  }

  return errors;
}

export function sanitizeCreateDebtorDto(body: CreateDebtorDto): CreateDebtorDto {
  const sanitized: CreateDebtorDto = {
    name: body.name.trim(),
    description: body.description.trim(),
    amount: Number(body.amount),
    principal_amount: Number(body.principal_amount),
    due_date: body.due_date.trim(),
    status: isValidDebtorStatus(body.status.trim().toLowerCase())
      ? normalizeDebtorStatus(body.status)
      : body.status.trim().toLowerCase(),
    user_id_applicant: Number(body.user_id_applicant),
    user_id_owner: Number(body.user_id_owner),
  };

  if (body.uuid !== undefined) {
    sanitized.uuid = body.uuid.trim();
  }

  return sanitized;
}
