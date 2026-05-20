import type { UpdateProjectDto } from '@/modules/projects/dtos/update-project.dto.js';
import { serializeTags } from '@/modules/projects/lib/tags.js';
import { toProjectResponse } from '@/modules/projects/mappers/project.mapper.js';
import { findProjectByIdRepository } from '@/modules/projects/repositories/find-project-by-id.repository.js';
import { updateProjectRepository } from '@/modules/projects/repositories/update-project.repository.js';
import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';

export async function updateProjectService(id: number, dto: UpdateProjectDto) {
  const project = await findProjectByIdRepository(id);

  if (!project) {
    throw new AppError(404, 'Projeto não encontrado.', ErrorCodes.NOT_FOUND, 'Não encontrado');
  }

  const updateData: {
    name_project?: string;
    sub_title?: string;
    tags?: string;
    description?: string;
    foto_url?: string;
    updated_at: Date;
  } = { updated_at: new Date() };

  if (dto.name_project !== undefined) updateData.name_project = dto.name_project;
  if (dto.sub_title !== undefined) updateData.sub_title = dto.sub_title;
  if (dto.tags !== undefined) updateData.tags = serializeTags(dto.tags);
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.foto_url !== undefined) updateData.foto_url = dto.foto_url;

  const updated = await updateProjectRepository(id, updateData);
  return toProjectResponse(updated);
}
