import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeCreateTransactionDto,
  validateCreateTransactionDto,
  type CreateTransactionDto,
} from '@/modules/transactions/dtos/create-transaction.dto.js';
import { createTransactionService } from '@/modules/transactions/services/create-transaction.service.js';

export async function createTransactionController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateTransactionDto;
  const errors = validateCreateTransactionDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados da transação.', errors, 'Cadastro inválido');
  }

  const dto = sanitizeCreateTransactionDto(body);
  const transaction = await createTransactionService(dto);

  return reply.code(201).send({
    success: true,
    status_code: 201,
    data: transaction,
  });
}
