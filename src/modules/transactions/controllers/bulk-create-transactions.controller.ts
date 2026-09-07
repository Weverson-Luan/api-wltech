import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  validateBulkCreateTransactionsDto,
  type BulkCreateTransactionsDto,
} from '@/modules/transactions/dtos/bulk-create-transactions.dto.js';
import { bulkCreateTransactionsService } from '@/modules/transactions/services/bulk-create-transactions.service.js';

export async function bulkCreateTransactionsController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as BulkCreateTransactionsDto;
  const errors = validateBulkCreateTransactionsDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados do lote de transações.', errors, 'Lote inválido');
  }

  const result = await bulkCreateTransactionsService(body.items, request.user.sub);
  const hasSuccess = result.summary.created > 0 || result.summary.duplicate > 0;
  const statusCode = hasSuccess ? 201 : 400;

  return reply.code(statusCode).send({
    success: hasSuccess,
    status_code: statusCode,
    data: result,
  });
}
