import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildSuccessResponse } from '@/lib/errors/error-response.js';
import { listUsersService } from '@/modules/users/services/list-users.service.js';

export async function listUsersController(_request: FastifyRequest, reply: FastifyReply) {
  const users = await listUsersService();
  return reply.send(buildSuccessResponse(200, users));
}
