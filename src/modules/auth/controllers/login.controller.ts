/**
 * IMPORTS
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { failValidation } from '@/lib/errors/http-error.js';
import { loginService } from '@/modules/auth/services/login.service.js';
import {
  sanitizeLoginDto,
  validateLoginDto,
  type LoginDto,
} from '@/modules/auth/dtos/login.dto.js';

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as LoginDto;
  const errors = validateLoginDto(body);

  if (errors.length > 0) {
    failValidation('Verifique o e-mail e a senha informados.', errors, 'Login inválido');
  }

  const dto = sanitizeLoginDto(body);
  const user = await loginService(dto);

  const access_token = await reply.jwtSign({
    sub: user.id,
    email: user.email,
    role_name: user.role_name,
  });

  return reply.send(
    buildSuccessResponse(200, {
      access_token,
      user,
    }),
  );
}
