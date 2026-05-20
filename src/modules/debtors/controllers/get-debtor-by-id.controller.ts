import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { getDebtorByIdService } from '@/modules/debtors/services/get-debtor-by-id.service.js';

export async function getDebtorByIdController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do devedor inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const debtor = await getDebtorByIdService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: debtor,
  });
}
