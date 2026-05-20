import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { deleteProjectService } from '@/modules/projects/services/delete-project.service.js';

export async function deleteProjectController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do projeto inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const result = await deleteProjectService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: result,
  });
}
