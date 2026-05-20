import {
  isValidPaymentMethod,
  isValidTransactionType,
  normalizePaymentMethod,
  normalizeTransactionType,
  validatePaymentMethod,
  validateTransactionType,
} from '@/modules/transactions/lib/transaction-fields.js';

export type CreateTransactionDto = {
  user_id: number;
  type: string;
  amount: number;
  category_id: number;
  payment_method: string;
  date: string;
};

export type CreateTransactionValidationError = {
  field: string;
  message: string;
};

export function validateCreateTransactionDto(
  body: CreateTransactionDto,
): CreateTransactionValidationError[] {
  const errors: CreateTransactionValidationError[] = [];

  if (
    body.user_id === undefined ||
    body.user_id === null ||
    !Number.isInteger(Number(body.user_id)) ||
    Number(body.user_id) <= 0
  ) {
    errors.push({ field: 'user_id', message: 'ID do usuário é obrigatório.' });
  }

  const typeResult = validateTransactionType(body.type);
  if (!typeResult.valid) {
    errors.push({ field: 'type', message: typeResult.message });
  }

  if (body.amount === undefined || body.amount === null || Number.isNaN(Number(body.amount))) {
    errors.push({ field: 'amount', message: 'Valor é obrigatório e deve ser numérico.' });
  } else if (Number(body.amount) <= 0) {
    errors.push({ field: 'amount', message: 'Valor deve ser maior que zero.' });
  }

  if (
    body.category_id === undefined ||
    body.category_id === null ||
    !Number.isInteger(Number(body.category_id)) ||
    Number(body.category_id) <= 0
  ) {
    errors.push({ field: 'category_id', message: 'ID da categoria é obrigatório.' });
  }

  const paymentResult = validatePaymentMethod(body.payment_method);
  if (!paymentResult.valid) {
    errors.push({ field: 'payment_method', message: paymentResult.message });
  }

  if (!body.date?.trim()) {
    errors.push({ field: 'date', message: 'Data é obrigatória.' });
  } else if (Number.isNaN(Date.parse(body.date))) {
    errors.push({ field: 'date', message: 'Data inválida.' });
  }

  return errors;
}

export function sanitizeCreateTransactionDto(body: CreateTransactionDto): CreateTransactionDto {
  return {
    user_id: Number(body.user_id),
    type: isValidTransactionType(body.type.trim().toLowerCase())
      ? normalizeTransactionType(body.type)
      : body.type.trim().toLowerCase(),
    amount: Number(body.amount),
    category_id: Number(body.category_id),
    payment_method: isValidPaymentMethod(body.payment_method.trim().toLowerCase())
      ? normalizePaymentMethod(body.payment_method)
      : body.payment_method.trim().toLowerCase(),
    date: body.date.trim(),
  };
}
