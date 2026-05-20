import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { meService } from '@/modules/auth/services/me.service.js';

export async function meController(request: FastifyRequest, reply: FastifyReply) {
  const user = await meService(request.user.sub);
  return reply.send(buildSuccessResponse(200, user));
}
