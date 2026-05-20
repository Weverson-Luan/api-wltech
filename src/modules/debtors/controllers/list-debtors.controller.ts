import type { FastifyReply, FastifyRequest } from 'fastify';
import { listDebtorsService } from '@/modules/debtors/services/list-debtors.service.js';

export async function listDebtorsController(_request: FastifyRequest, reply: FastifyReply) {
  const debtors = await listDebtorsService();

  return reply.send({
    success: true,
    status_code: 200,
    data: debtors,
  });
}
