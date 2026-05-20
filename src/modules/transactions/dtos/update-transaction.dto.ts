import {
  isValidPaymentMethod,
  isValidTransactionType,
  normalizePaymentMethod,
  normalizeTransactionType,
  validatePaymentMethod,
  validateTransactionType,
} from '@/modules/transactions/lib/transaction-fields.js';

export type UpdateTransactionDto = {
  user_id?: number;
  type?: string;
  amount?: number;
  category_id?: number;
  payment_method?: string;
  date?: string;
};

export type UpdateTransactionValidationError = {
  field: string;
  message: string;
};

export function validateUpdateTransactionDto(
  body: UpdateTransactionDto,
): UpdateTransactionValidationError[] {
  const errors: UpdateTransactionValidationError[] = [];
  const hasAnyField =
    body.user_id !== undefined ||
    body.type !== undefined ||
    body.amount !== undefined ||
    body.category_id !== undefined ||
    body.payment_method !== undefined ||
    body.date !== undefined;

  if (!hasAnyField) {
    errors.push({ field: 'body', message: 'Informe ao menos um campo para atualizar.' });
    return errors;
  }

  if (body.user_id !== undefined) {
    if (!Number.isInteger(Number(body.user_id)) || Number(body.user_id) <= 0) {
      errors.push({ field: 'user_id', message: 'ID do usuário inválido.' });
    }
  }

  if (body.type !== undefined) {
    const typeResult = validateTransactionType(body.type);
    if (!typeResult.valid) {
      errors.push({ field: 'type', message: typeResult.message });
    }
  }

  if (body.amount !== undefined) {
    if (Number.isNaN(Number(body.amount))) {
      errors.push({ field: 'amount', message: 'Valor deve ser numérico.' });
    } else if (Number(body.amount) <= 0) {
      errors.push({ field: 'amount', message: 'Valor deve ser maior que zero.' });
    }
  }

  if (body.category_id !== undefined) {
    if (!Number.isInteger(Number(body.category_id)) || Number(body.category_id) <= 0) {
      errors.push({ field: 'category_id', message: 'ID da categoria inválido.' });
    }
  }

  if (body.payment_method !== undefined) {
    const paymentResult = validatePaymentMethod(body.payment_method);
    if (!paymentResult.valid) {
      errors.push({ field: 'payment_method', message: paymentResult.message });
    }
  }

  if (body.date !== undefined) {
    if (!body.date.trim()) {
      errors.push({ field: 'date', message: 'Data não pode ser vazia.' });
    } else if (Number.isNaN(Date.parse(body.date))) {
      errors.push({ field: 'date', message: 'Data inválida.' });
    }
  }

  return errors;
}

export function sanitizeUpdateTransactionDto(body: UpdateTransactionDto): UpdateTransactionDto {
  const sanitized: UpdateTransactionDto = {};

  if (body.user_id !== undefined) sanitized.user_id = Number(body.user_id);
  if (body.type !== undefined) {
    sanitized.type = isValidTransactionType(body.type.trim().toLowerCase())
      ? normalizeTransactionType(body.type)
      : body.type.trim().toLowerCase();
  }
  if (body.amount !== undefined) sanitized.amount = Number(body.amount);
  if (body.category_id !== undefined) sanitized.category_id = Number(body.category_id);
  if (body.payment_method !== undefined) {
    sanitized.payment_method = isValidPaymentMethod(body.payment_method.trim().toLowerCase())
      ? normalizePaymentMethod(body.payment_method)
      : body.payment_method.trim().toLowerCase();
  }
  if (body.date !== undefined) sanitized.date = body.date.trim();

  return sanitized;
}
