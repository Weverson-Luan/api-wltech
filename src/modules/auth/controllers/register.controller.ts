import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeRegisterDto,
  validateRegisterDto,
  type RegisterDto,
} from '@/modules/auth/dtos/register.dto.js';
import { registerService } from '@/modules/auth/services/register.service.js';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as RegisterDto;
  const errors = validateRegisterDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados do cadastro.', errors, 'Cadastro inválido');
  }

  const dto = sanitizeRegisterDto(body);
  const user = await registerService(dto);

  const access_token = await reply.jwtSign({
    sub: user.id,
    email: user.email,
    role_name: user.role_name,
  });

  return reply.code(201).send(
    buildSuccessResponse(201, {
      access_token,
      user,
    }),
  );
}
