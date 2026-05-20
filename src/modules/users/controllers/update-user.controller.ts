import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeUpdateUserDto,
  validateUpdateUserDto,
  type UpdateUserDto,
} from '@/modules/users/dtos/update-user.dto.js';
import { updateUserService } from '@/modules/users/services/update-user.service.js';

export async function updateUserController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('O id do usuário deve ser um número.', [
      { field: 'id', message: 'Id inválido.' },
    ]);
  }

  const body = request.body as UpdateUserDto;
  const errors = validateUpdateUserDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados para atualização.', errors, 'Atualização inválida');
  }

  const dto = sanitizeUpdateUserDto(body);
  const user = await updateUserService({ id, dto, requester: request.user });

  return reply.send(buildSuccessResponse(200, user));
}
