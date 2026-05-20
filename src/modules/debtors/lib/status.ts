const DEBTOR_STATUSES = ['pending', 'paid', 'overdue', 'cancelled'] as const;

export type DebtorStatus = (typeof DEBTOR_STATUSES)[number];

export function isValidDebtorStatus(status: string): status is DebtorStatus {
  return DEBTOR_STATUSES.includes(status as DebtorStatus);
}

export function validateDebtorStatus(status: string): { valid: true } | { valid: false; message: string } {
  if (!status?.trim()) {
    return { valid: false, message: 'Status é obrigatório.' };
  }

  const normalized = status.trim().toLowerCase();

  if (!isValidDebtorStatus(normalized)) {
    return {
      valid: false,
      message: `Status inválido. Use: ${DEBTOR_STATUSES.join(', ')}.`,
    };
  }

  return { valid: true };
}

export function normalizeDebtorStatus(status: string): DebtorStatus {
  return status.trim().toLowerCase() as DebtorStatus;
}
