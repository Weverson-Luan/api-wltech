import {
  sanitizeCreateDebtorDto,
  validateCreateDebtorDto,
  type CreateDebtorDto,
} from '@/modules/debtors/dtos/create-debtor.dto.js';
import type { DebtorResponseDto } from '@/modules/debtors/dtos/debtor-response.dto.js';
import { sanitizeUuid, validateUuid } from '@/lib/validators/uuid.js';

export type BulkCreateDebtorItemDto = CreateDebtorDto & {
  uuid: string;
};

export type BulkCreateDebtorsDto = {
  items: BulkCreateDebtorItemDto[];
};

export type BulkDebtorItemResult =
  | {
      uuid: string;
      status: 'created' | 'duplicate';
      server_id: number;
      data: DebtorResponseDto;
    }
  | {
      uuid: string;
      status: 'failed';
      errors: { field: string; message: string }[];
    };

export type BulkCreateDebtorsResult = {
  summary: {
    total: number;
    created: number;
    duplicate: number;
    failed: number;
  };
  results: BulkDebtorItemResult[];
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 100;

export function validateBulkCreateDebtorsDto(body: BulkCreateDebtorsDto): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (!Array.isArray(body.items)) {
    errors.push({ field: 'items', message: 'Items deve ser um array.' });
    return errors;
  }

  if (body.items.length < MIN_ITEMS) {
    errors.push({ field: 'items', message: 'Informe ao menos um devedor.' });
  }

  if (body.items.length > MAX_ITEMS) {
    errors.push({ field: 'items', message: 'Máximo de 100 devedores por requisição.' });
  }

  return errors;
}

export function validateBulkCreateDebtorItem(
  item: BulkCreateDebtorItemDto,
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];
  const uuidError = validateUuid(item.uuid);

  if (uuidError) {
    errors.push(uuidError);
  }

  errors.push(...validateCreateDebtorDto(item));
  return errors;
}

export function sanitizeBulkCreateDebtorItem(item: BulkCreateDebtorItemDto): BulkCreateDebtorItemDto {
  return {
    ...sanitizeCreateDebtorDto(item),
    uuid: sanitizeUuid(item.uuid),
  };
}
