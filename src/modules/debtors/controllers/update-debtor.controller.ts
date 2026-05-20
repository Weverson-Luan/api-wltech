import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeUpdateDebtorDto,
  validateUpdateDebtorDto,
  type UpdateDebtorDto,
} from '@/modules/debtors/dtos/update-debtor.dto.js';
import { updateDebtorService } from '@/modules/debtors/services/update-debtor.service.js';

export async function updateDebtorController(request: FastifyRequest, reply: FastifyReply) {
  const id = Number((request.params as { id: string }).id);

  if (Number.isNaN(id)) {
    failValidation('Id do devedor inválido.', [{ field: 'id', message: 'Id deve ser um número.' }]);
  }

  const body = request.body as UpdateDebtorDto;
  const errors = validateUpdateDebtorDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados para atualização.', errors, 'Atualização inválida');
  }

  const dto = sanitizeUpdateDebtorDto(body);
  const debtor = await updateDebtorService(id, dto);

  return reply.send({
    success: true,
    status_code: 200,
    data: debtor,
  });
}
