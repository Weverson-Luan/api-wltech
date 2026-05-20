import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { toProjectResponse } from '@/modules/projects/mappers/project.mapper.js';
import { findProjectByIdRepository } from '@/modules/projects/repositories/find-project-by-id.repository.js';

export async function getProjectByIdService(id: number) {
  const project = await findProjectByIdRepository(id);

  if (!project) {
    throw new AppError(404, 'Projeto não encontrado.', ErrorCodes.NOT_FOUND, 'Não encontrado');
  }

  return toProjectResponse(project);
}
