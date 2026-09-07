import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  validateBulkCreateDebtorsDto,
  type BulkCreateDebtorsDto,
} from '@/modules/debtors/dtos/bulk-create-debtors.dto.js';
import { bulkCreateDebtorsService } from '@/modules/debtors/services/bulk-create-debtors.service.js';

export async function bulkCreateDebtorsController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as BulkCreateDebtorsDto;
  const errors = validateBulkCreateDebtorsDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados do lote de devedores.', errors, 'Lote inválido');
  }

  const result = await bulkCreateDebtorsService(body.items);
  const hasSuccess = result.summary.created > 0 || result.summary.duplicate > 0;
  const statusCode = hasSuccess ? 201 : 400;

  return reply.code(statusCode).send({
    success: hasSuccess,
    status_code: statusCode,
    data: result,
  });
}
