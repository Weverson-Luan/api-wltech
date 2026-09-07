import { AppError } from '@/lib/errors/app-error.js';
import {
  sanitizeBulkCreateTransactionItem,
  validateBulkCreateTransactionItem,
  type BulkCreateTransactionItemDto,
  type BulkCreateTransactionsResult,
  type BulkTransactionItemResult,
} from '@/modules/transactions/dtos/bulk-create-transactions.dto.js';
import { toTransactionResponse } from '@/modules/transactions/mappers/transaction.mapper.js';
import { findTransactionByUuidRepository } from '@/modules/transactions/repositories/find-transaction-by-uuid.repository.js';
import { createTransactionService } from '@/modules/transactions/services/create-transaction.service.js';

export async function bulkCreateTransactionsService(
  items: BulkCreateTransactionItemDto[],
  authenticatedUserId: number,
): Promise<BulkCreateTransactionsResult> {
  const results: BulkTransactionItemResult[] = [];
  const seenUuids = new Set<string>();

  for (const rawItem of items) {
    const uuid = rawItem.uuid?.trim() ?? '';

    if (seenUuids.has(uuid)) {
      results.push({
        uuid,
        status: 'failed',
        errors: [{ field: 'uuid', message: 'UUID duplicado no mesmo lote.' }],
      });
      continue;
    }

    seenUuids.add(uuid);

    const errors = validateBulkCreateTransactionItem(rawItem, authenticatedUserId);
    if (errors.length > 0) {
      results.push({ uuid, status: 'failed', errors });
      continue;
    }

    const item = sanitizeBulkCreateTransactionItem(rawItem);
    const existing = await findTransactionByUuidRepository(item.uuid);

    if (existing) {
      results.push({
        uuid: item.uuid,
        status: 'duplicate',
        server_id: existing.id,
        data: toTransactionResponse(existing),
      });
      continue;
    }

    try {
      const created = await createTransactionService({
        ...item,
        user_id: authenticatedUserId,
      });
      results.push({
        uuid: item.uuid,
        status: 'created',
        server_id: created.id,
        data: created,
      });
    } catch (error) {
      if (error instanceof AppError) {
        results.push({
          uuid: item.uuid,
          status: 'failed',
          errors: error.errors ?? [{ field: 'body', message: error.message }],
        });
        continue;
      }

      throw error;
    }
  }

  const created = results.filter((r) => r.status === 'created').length;
  const duplicate = results.filter((r) => r.status === 'duplicate').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return {
    summary: {
      total: results.length,
      created,
      duplicate,
      failed,
    },
    results,
  };
}
