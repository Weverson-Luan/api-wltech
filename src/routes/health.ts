import type { FastifyInstance } from 'fastify';
import { buildErrorResponse } from '@/lib/errors/error-response.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { isDatabaseHealthy } from '@/lib/db-health.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (_request, reply) => {
    const database = await isDatabaseHealthy();

    if (!database) {
      const payload = buildErrorResponse({
        statusCode: 503,
        code: ErrorCodes.SERVICE_UNAVAILABLE,
        title: 'Serviço indisponível',
        message: 'O banco de dados está indisponível no momento. Tente novamente em instantes.',
      });

      return reply.status(503).send({
        ...payload,
        data: { database: 'down', api: 'up' },
      });
    }

    return reply.send({
      success: true,
      status_code: 200,
      data: {
        status: 'ok',
        database: 'up',
        api: 'up',
      },
    });
  });
}
