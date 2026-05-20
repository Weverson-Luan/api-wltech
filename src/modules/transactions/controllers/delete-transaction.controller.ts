import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { deleteTransactionService } from '@/modules/transactions/services/delete-transaction.service.js';

export async function deleteTransactionController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id da transação inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const result = await deleteTransactionService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: result,
  });
}
