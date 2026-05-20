import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeUpdateTransactionDto,
  validateUpdateTransactionDto,
  type UpdateTransactionDto,
} from '@/modules/transactions/dtos/update-transaction.dto.js';
import { updateTransactionService } from '@/modules/transactions/services/update-transaction.service.js';

export async function updateTransactionController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id da transação inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const body = request.body as UpdateTransactionDto;
  const errors = validateUpdateTransactionDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados para atualização.', errors, 'Atualização inválida');
  }

  const dto = sanitizeUpdateTransactionDto(body);
  const transaction = await updateTransactionService(id, dto);

  return reply.send({
    success: true,
    status_code: 200,
    data: transaction,
  });
}
