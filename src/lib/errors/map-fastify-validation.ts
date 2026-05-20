import type { FastifySchemaValidationError } from 'fastify/types/schema.js';
import type { FieldError } from '@/lib/errors/error-response.js';

const FIELD_LABELS: Record<string, string> = {
  name: 'nome',
  email: 'e-mail',
  password: 'senha',
  phone: 'telefone',
  name_app: 'nome do app',
  description_project: 'descrição do projeto',
  platform: 'plataforma',
  delivery_time: 'prazo de entrega',
  main_features: 'funcionalidades',
  budget_available: 'orçamento disponível',
};

function fieldLabel(field: string) {
  return FIELD_LABELS[field] ?? field;
}

function translateIssue(issue: FastifySchemaValidationError): string {
  const field = fieldLabel(
    issue.instancePath?.replace(/^\//, '') ||
      (issue.params as { missingProperty?: string })?.missingProperty ||
      'campo',
  );

  if (issue.keyword === 'required') {
    return `O campo ${field} é obrigatório.`;
  }

  if (issue.keyword === 'format' && (issue.params as { format?: string })?.format === 'email') {
    return `Informe um ${field} válido.`;
  }

  if (issue.keyword === 'minLength') {
    const limit = (issue.params as { limit?: number })?.limit ?? 1;
    return `O campo ${field} deve ter pelo menos ${limit} caracteres.`;
  }

  if (issue.keyword === 'additionalProperties') {
    return 'Existem campos não permitidos na requisição.';
  }

  return issue.message ?? `O campo ${field} é inválido.`;
}

export function mapFastifyValidation(issues: FastifySchemaValidationError[]): FieldError[] {
  return issues.map((issue) => {
    const field =
      issue.instancePath?.replace(/^\//, '') ||
      (issue.params as { missingProperty?: string })?.missingProperty ||
      'body';

    return {
      field,
      message: translateIssue(issue),
    };
  });
}
