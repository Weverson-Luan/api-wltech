import type { ProjectResponseDto } from '@/modules/projects/dtos/project-response.dto.js';
import { parseTags } from '@/modules/projects/lib/tags.js';
import type { ProjectRecord } from '@/modules/projects/types/project.types.js';

export function toProjectResponse(project: ProjectRecord): ProjectResponseDto {
  return {
    id: project.id,
    name_project: project.name_project,
    sub_title: project.sub_title,
    tags: parseTags(project.tags),
    description: project.description,
    foto_url: project.foto_url,
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}
