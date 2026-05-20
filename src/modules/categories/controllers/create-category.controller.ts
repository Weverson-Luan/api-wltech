import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeCreateCategoryDto,
  validateCreateCategoryDto,
  type CreateCategoryDto,
} from '@/modules/categories/dtos/create-category.dto.js';
import { createCategoryService } from '@/modules/categories/services/create-category.service.js';

export async function createCategoryController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateCategoryDto;
  const errors = validateCreateCategoryDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados da categoria.', errors, 'Cadastro inválido');
  }

  const dto = sanitizeCreateCategoryDto(body);
  const category = await createCategoryService(dto);

  return reply.code(201).send({
    success: true,
    status_code: 201,
    data: category,
  });
}
