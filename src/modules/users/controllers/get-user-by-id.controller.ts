import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { failValidation } from '@/lib/errors/http-error.js';
import { getUserByIdService } from '@/modules/users/services/get-user-by-id.service.js';

export async function getUserByIdController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do usuário inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const user = await getUserByIdService({ id, requester: request.user });

  return reply.send(buildSuccessResponse(200, user));
}
