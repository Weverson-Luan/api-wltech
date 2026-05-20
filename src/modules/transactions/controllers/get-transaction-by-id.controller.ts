import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { getTransactionByIdService } from '@/modules/transactions/services/get-transaction-by-id.service.js';

export async function getTransactionByIdController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id da transação inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const transaction = await getTransactionByIdService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: transaction,
  });
}
