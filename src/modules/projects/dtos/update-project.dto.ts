import { validateTags } from '@/modules/projects/lib/tags.js';

export type UpdateProjectDto = {
  name_project?: string;
  sub_title?: string;
  tags?: string[];
  description?: string;
  foto_url?: string;
};

export type UpdateProjectValidationError = {
  field: string;
  message: string;
};

export function validateUpdateProjectDto(body: UpdateProjectDto): UpdateProjectValidationError[] {
  const errors: UpdateProjectValidationError[] = [];
  const hasAnyField =
    body.name_project !== undefined ||
    body.sub_title !== undefined ||
    body.tags !== undefined ||
    body.description !== undefined ||
    body.foto_url !== undefined;

  if (!hasAnyField) {
    errors.push({ field: 'body', message: 'Informe ao menos um campo para atualizar.' });
    return errors;
  }

  if (body.name_project !== undefined && body.name_project.trim().length < 2) {
    errors.push({ field: 'name_project', message: 'Nome do projeto deve ter pelo menos 2 caracteres.' });
  }

  if (body.sub_title !== undefined && body.sub_title.trim().length < 2) {
    errors.push({ field: 'sub_title', message: 'Subtítulo deve ter pelo menos 2 caracteres.' });
  }

  if (body.tags !== undefined) {
    const tagsResult = validateTags(body.tags);
    if (!tagsResult.valid) {
      errors.push({ field: 'tags', message: tagsResult.message ?? 'Tags inválidas.' });
    }
  }

  if (body.description !== undefined && body.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Descrição deve ter pelo menos 10 caracteres.',
    });
  }

  if (body.foto_url !== undefined) {
    if (!body.foto_url.trim()) {
      errors.push({ field: 'foto_url', message: 'URL da foto é obrigatória.' });
    } else {
      try {
        new URL(body.foto_url.trim());
      } catch {
        errors.push({ field: 'foto_url', message: 'Informe uma URL de foto válida.' });
      }
    }
  }

  return errors;
}

export function sanitizeUpdateProjectDto(body: UpdateProjectDto): UpdateProjectDto {
  const sanitized: UpdateProjectDto = {};

  if (body.name_project !== undefined) sanitized.name_project = body.name_project.trim();
  if (body.sub_title !== undefined) sanitized.sub_title = body.sub_title.trim();
  if (body.description !== undefined) sanitized.description = body.description.trim();
  if (body.foto_url !== undefined) sanitized.foto_url = body.foto_url.trim();

  if (body.tags !== undefined) {
    const tagsResult = validateTags(body.tags);
    sanitized.tags = tagsResult.valid ? tagsResult.tags : [];
  }

  return sanitized;
}
