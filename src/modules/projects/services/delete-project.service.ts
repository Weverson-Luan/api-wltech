import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { deleteProjectRepository } from '@/modules/projects/repositories/delete-project.repository.js';
import { findProjectByIdRepository } from '@/modules/projects/repositories/find-project-by-id.repository.js';

export async function deleteProjectService(id: number) {
  const project = await findProjectByIdRepository(id);

  if (!project) {
    throw new AppError(404, 'Projeto não encontrado.', ErrorCodes.NOT_FOUND, 'Não encontrado');
  }

  const deleted = await deleteProjectRepository(id);

  if (!deleted) {
    throw new AppError(
      500,
      'Não foi possível excluir o projeto.',
      ErrorCodes.INTERNAL_ERROR,
      'Erro interno',
    );
  }

  return { id, deleted: true };
}
