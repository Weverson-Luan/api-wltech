import { AppError } from '@/lib/errors/app-error.js';
import {
  sanitizeBulkCreateDebtorItem,
  validateBulkCreateDebtorItem,
  type BulkCreateDebtorItemDto,
  type BulkCreateDebtorsResult,
  type BulkDebtorItemResult,
} from '@/modules/debtors/dtos/bulk-create-debtors.dto.js';
import { toDebtorResponse } from '@/modules/debtors/mappers/debtor.mapper.js';
import { findDebtorByUuidRepository } from '@/modules/debtors/repositories/find-debtor-by-uuid.repository.js';
import { createDebtorService } from '@/modules/debtors/services/create-debtor.service.js';

export async function bulkCreateDebtorsService(
  items: BulkCreateDebtorItemDto[],
): Promise<BulkCreateDebtorsResult> {
  const results: BulkDebtorItemResult[] = [];
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

    const errors = validateBulkCreateDebtorItem(rawItem);
    if (errors.length > 0) {
      results.push({ uuid, status: 'failed', errors });
      continue;
    }

    const item = sanitizeBulkCreateDebtorItem(rawItem);
    const existing = await findDebtorByUuidRepository(item.uuid);

    if (existing) {
      results.push({
        uuid: item.uuid,
        status: 'duplicate',
        server_id: existing.id,
        data: toDebtorResponse(existing),
      });
      continue;
    }

    try {
      const created = await createDebtorService(item);
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
