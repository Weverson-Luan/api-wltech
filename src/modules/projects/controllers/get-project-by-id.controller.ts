import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { getProjectByIdService } from '@/modules/projects/services/get-project-by-id.service.js';

export async function getProjectByIdController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do projeto inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const project = await getProjectByIdService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: project,
  });
}
