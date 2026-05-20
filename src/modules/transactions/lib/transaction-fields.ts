const TRANSACTION_TYPES = ['income', 'expense'] as const;

const PAYMENT_METHODS = ['pix', 'cash', 'credit_card', 'debit_card', 'transfer', 'other'] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isValidTransactionType(type: string): type is TransactionType {
  return TRANSACTION_TYPES.includes(type as TransactionType);
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return PAYMENT_METHODS.includes(method as PaymentMethod);
}

export function validateTransactionType(type: string): { valid: true } | { valid: false; message: string } {
  if (!type?.trim()) {
    return { valid: false, message: 'Tipo é obrigatório.' };
  }

  const normalized = type.trim().toLowerCase();

  if (!isValidTransactionType(normalized)) {
    return {
      valid: false,
      message: `Tipo inválido. Use: ${TRANSACTION_TYPES.join(', ')}.`,
    };
  }

  return { valid: true };
}

export function validatePaymentMethod(
  method: string,
): { valid: true } | { valid: false; message: string } {
  if (!method?.trim()) {
    return { valid: false, message: 'Método de pagamento é obrigatório.' };
  }

  const normalized = method.trim().toLowerCase();

  if (!isValidPaymentMethod(normalized)) {
    return {
      valid: false,
      message: `Método de pagamento inválido. Use: ${PAYMENT_METHODS.join(', ')}.`,
    };
  }

  return { valid: true };
}

export function normalizeTransactionType(type: string): TransactionType {
  return type.trim().toLowerCase() as TransactionType;
}

export function normalizePaymentMethod(method: string): PaymentMethod {
  return method.trim().toLowerCase() as PaymentMethod;
}
