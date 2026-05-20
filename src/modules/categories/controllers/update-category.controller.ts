import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeUpdateCategoryDto,
  validateUpdateCategoryDto,
  type UpdateCategoryDto,
} from '@/modules/categories/dtos/update-category.dto.js';
import { updateCategoryService } from '@/modules/categories/services/update-category.service.js';

export async function updateCategoryController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id da categoria inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const body = request.body as UpdateCategoryDto;
  const errors = validateUpdateCategoryDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados para atualização.', errors, 'Atualização inválida');
  }

  const dto = sanitizeUpdateCategoryDto(body);
  const category = await updateCategoryService(id, dto);

  return reply.send({
    success: true,
    status_code: 200,
    data: category,
  });
}
