export type UuidValidationError = {
  field: string;
  message: string;
};

export function validateUuid(uuid: string | undefined): UuidValidationError | null {
  if (!uuid?.trim()) {
    return { field: 'uuid', message: 'UUID é obrigatório.' };
  }

  if (uuid.trim().length > 255) {
    return { field: 'uuid', message: 'UUID deve ter no máximo 255 caracteres.' };
  }

  return null;
}

export function sanitizeUuid(uuid: string): string {
  return uuid.trim();
}
