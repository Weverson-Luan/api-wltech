import type { CreateProjectDto } from '@/modules/projects/dtos/create-project.dto.js';
import { serializeTags } from '@/modules/projects/lib/tags.js';
import { toProjectResponse } from '@/modules/projects/mappers/project.mapper.js';
import { createProjectRepository } from '@/modules/projects/repositories/create-project.repository.js';

export async function createProjectService(dto: CreateProjectDto) {
  const project = await createProjectRepository({
    name_project: dto.name_project,
    sub_title: dto.sub_title,
    tags: serializeTags(dto.tags),
    description: dto.description,
    foto_url: dto.foto_url,
  });

  return toProjectResponse(project);
}
