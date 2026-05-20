import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeCreateDebtorDto,
  validateCreateDebtorDto,
  type CreateDebtorDto,
} from '@/modules/debtors/dtos/create-debtor.dto.js';
import { createDebtorService } from '@/modules/debtors/services/create-debtor.service.js';

export async function createDebtorController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateDebtorDto;
  const errors = validateCreateDebtorDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados do devedor.', errors, 'Cadastro inválido');
  }

  const dto = sanitizeCreateDebtorDto(body);
  const debtor = await createDebtorService(dto);

  return reply.code(201).send({
    success: true,
    status_code: 201,
    data: debtor,
  });
}
