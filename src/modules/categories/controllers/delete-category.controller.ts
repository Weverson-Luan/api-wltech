import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import { deleteCategoryService } from '@/modules/categories/services/delete-category.service.js';

export async function deleteCategoryController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id da categoria inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const result = await deleteCategoryService(id);

  return reply.send({
    success: true,
    status_code: 200,
    data: result,
  });
}
