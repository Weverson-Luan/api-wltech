import type { FastifyReply, FastifyRequest } from 'fastify';
import { listTransactionsService } from '@/modules/transactions/services/list-transactions.service.js';

export async function listTransactionsController(_request: FastifyRequest, reply: FastifyReply) {
  const transactions = await listTransactionsService();

  return reply.send({
    success: true,
    status_code: 200,
    data: transactions,
  });
}
