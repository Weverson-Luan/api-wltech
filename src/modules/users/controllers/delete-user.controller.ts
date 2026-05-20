import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { failValidation } from '@/lib/errors/http-error.js';
import { deleteUserService } from '@/modules/users/services/delete-user.service.js';

export async function deleteUserController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do usuário inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const result = await deleteUserService({ id, requester: request.user });

  return reply.send(buildSuccessResponse(200, result));
}
