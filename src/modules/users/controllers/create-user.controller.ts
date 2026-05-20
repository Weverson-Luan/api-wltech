import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeCreateUserDto,
  validateCreateUserDto,
  type CreateUserDto,
} from '@/modules/users/dtos/create-user.dto.js';
import { createUserService } from '@/modules/users/services/create-user.service.js';

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateUserDto;
  const errors = validateCreateUserDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados do usuário.', errors, 'Cadastro inválido');
  }

  const dto = sanitizeCreateUserDto(body);
  const user = await createUserService(dto);

  return reply.code(201).send(buildSuccessResponse(201, user));
}
