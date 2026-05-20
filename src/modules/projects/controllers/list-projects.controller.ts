import type { FastifyReply, FastifyRequest } from 'fastify';
import { listProjectsService } from '@/modules/projects/services/list-projects.service.js';

export async function listProjectsController(_request: FastifyRequest, reply: FastifyReply) {
  const projects = await listProjectsService();

  return reply.send({
    success: true,
    status_code: 200,
    data: projects,
  });
}
