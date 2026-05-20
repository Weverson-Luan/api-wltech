import { validateTags } from '@/modules/projects/lib/tags.js';

export type CreateProjectDto = {
  name_project: string;
  sub_title: string;
  tags: string[];
  description: string;
  foto_url: string;
};

export type CreateProjectValidationError = {
  field: string;
  message: string;
};

export function validateCreateProjectDto(body: CreateProjectDto): CreateProjectValidationError[] {
  const errors: CreateProjectValidationError[] = [];

  if (!body.name_project?.trim() || body.name_project.trim().length < 2) {
    errors.push({ field: 'name_project', message: 'Nome do projeto deve ter pelo menos 2 caracteres.' });
  }

  if (!body.sub_title?.trim() || body.sub_title.trim().length < 2) {
    errors.push({ field: 'sub_title', message: 'Subtítulo deve ter pelo menos 2 caracteres.' });
  }

  const tagsResult = validateTags(body.tags);
  if (!tagsResult.valid) {
    errors.push({ field: 'tags', message: tagsResult.message ?? 'Tags inválidas.' });
  }

  if (!body.description?.trim() || body.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Descrição deve ter pelo menos 10 caracteres.',
    });
  }

  if (!body.foto_url?.trim()) {
    errors.push({ field: 'foto_url', message: 'URL da foto é obrigatória.' });
  } else {
    try {
      new URL(body.foto_url.trim());
    } catch {
      errors.push({ field: 'foto_url', message: 'Informe uma URL de foto válida.' });
    }
  }

  return errors;
}

export function sanitizeCreateProjectDto(body: CreateProjectDto): CreateProjectDto {
  const tagsResult = validateTags(body.tags);

  return {
    name_project: body.name_project.trim(),
    sub_title: body.sub_title.trim(),
    tags: tagsResult.valid ? tagsResult.tags : [],
    description: body.description.trim(),
    foto_url: body.foto_url.trim(),
  };
}
