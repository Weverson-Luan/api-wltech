import type { FastifyReply, FastifyRequest } from 'fastify';
import { listCategoriesService } from '@/modules/categories/services/list-categories.service.js';

export async function listCategoriesController(_request: FastifyRequest, reply: FastifyReply) {
  const categories = await listCategoriesService();

  return reply.send({
    success: true,
    status_code: 200,
    data: categories,
  });
}
