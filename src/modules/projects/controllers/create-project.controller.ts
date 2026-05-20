import type { FastifyReply, FastifyRequest } from 'fastify';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeCreateProjectDto,
  validateCreateProjectDto,
  type CreateProjectDto,
} from '@/modules/projects/dtos/create-project.dto.js';
import { createProjectService } from '@/modules/projects/services/create-project.service.js';

export async function createProjectController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as CreateProjectDto;
  const errors = validateCreateProjectDto(body);

  if (errors.length > 0) {
    failValidation('Verifique os dados do projeto.', errors, 'Projeto inválido');
  }

  const dto = sanitizeCreateProjectDto(body);
  const project = await createProjectService(dto);

  return reply.code(201).send({
    success: true,
    status_code: 201,
    data: project,
  });
}
