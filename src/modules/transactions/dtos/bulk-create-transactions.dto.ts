import {
  sanitizeCreateTransactionDto,
  validateCreateTransactionDto,
  type CreateTransactionDto,
} from '@/modules/transactions/dtos/create-transaction.dto.js';
import type { TransactionResponseDto } from '@/modules/transactions/dtos/transaction-response.dto.js';
import { sanitizeUuid, validateUuid } from '@/lib/validators/uuid.js';

export type BulkCreateTransactionItemDto = CreateTransactionDto & {
  uuid: string;
};

export type BulkCreateTransactionsDto = {
  items: BulkCreateTransactionItemDto[];
};

export type BulkTransactionItemResult =
  | {
      uuid: string;
      status: 'created' | 'duplicate';
      server_id: number;
      data: TransactionResponseDto;
    }
  | {
      uuid: string;
      status: 'failed';
      errors: { field: string; message: string }[];
    };

export type BulkCreateTransactionsResult = {
  summary: {
    total: number;
    created: number;
    duplicate: number;
    failed: number;
  };
  results: BulkTransactionItemResult[];
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 100;

export function validateBulkCreateTransactionsDto(
  body: BulkCreateTransactionsDto,
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (!Array.isArray(body.items)) {
    errors.push({ field: 'items', message: 'Items deve ser um array.' });
    return errors;
  }

  if (body.items.length < MIN_ITEMS) {
    errors.push({ field: 'items', message: 'Informe ao menos uma transação.' });
  }

  if (body.items.length > MAX_ITEMS) {
    errors.push({ field: 'items', message: 'Máximo de 100 transações por requisição.' });
  }

  return errors;
}

export function validateBulkCreateTransactionItem(
  item: BulkCreateTransactionItemDto,
  authenticatedUserId: number,
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];
  const uuidError = validateUuid(item.uuid);

  if (uuidError) {
    errors.push(uuidError);
  }

  errors.push(...validateCreateTransactionDto(item));

  if (
    item.user_id !== undefined &&
    item.user_id !== null &&
    Number.isInteger(Number(item.user_id)) &&
    Number(item.user_id) !== authenticatedUserId
  ) {
    errors.push({ field: 'user_id', message: 'Não é permitido sincronizar transação de outro usuário.' });
  }

  return errors;
}

export function sanitizeBulkCreateTransactionItem(
  item: BulkCreateTransactionItemDto,
): BulkCreateTransactionItemDto {
  return {
    ...sanitizeCreateTransactionDto(item),
    uuid: sanitizeUuid(item.uuid),
  };
}
