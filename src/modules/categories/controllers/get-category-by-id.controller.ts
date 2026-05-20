import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { getCategoryByIdService } from '@/modules/categories/services/get-category-by-id.service.js';

export async function getCategoryByIdController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id da categoria inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const category = await getCategoryByIdService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: category,
  });
}
