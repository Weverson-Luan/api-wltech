import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { deleteDebtorService } from '@/modules/debtors/services/delete-debtor.service.js';

export async function deleteDebtorController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do devedor inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const result = await deleteDebtorService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: result,
  });
}
