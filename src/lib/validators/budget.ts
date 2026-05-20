import {
  formatBrazilianPhone,
  isValidBrazilianPhone,
  normalizeBrazilianPhone,
} from '@/lib/validators/brazilian-phone.js';

export type CreateBudgetBody = {
  name: string;
  email: string;
  phone: string;
  name_app: string;
  description_project: string;
  platform: string;
  delivery_time: string;
  main_features: string;
  budget_available: string;
};

export type BudgetValidationError = {
  field: string;
  message: string;
};

export function validateCreateBudget(body: CreateBudgetBody): BudgetValidationError[] {
  const errors: BudgetValidationError[] = [];

  if (body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push({ field: 'email', message: 'E-mail inválido.' });
  }

  if (!isValidBrazilianPhone(body.phone)) {
    errors.push({
      field: 'phone',
      message: 'Telefone inválido. Use DDD + número (ex: 11999999999 ou (11) 99999-9999).',
    });
  }

  if (body.name_app.trim().length < 2) {
    errors.push({ field: 'name_app', message: 'Nome do app deve ter pelo menos 2 caracteres.' });
  }

  if (body.description_project.trim().length < 10) {
    errors.push({
      field: 'description_project',
      message: 'Descrição do projeto deve ter pelo menos 10 caracteres.',
    });
  }

  if (body.platform.trim().length < 2) {
    errors.push({ field: 'platform', message: 'Informe a plataforma do projeto.' });
  }

  if (body.delivery_time.trim().length < 2) {
    errors.push({ field: 'delivery_time', message: 'Informe o prazo de entrega.' });
  }

  if (body.main_features.trim().length < 5) {
    errors.push({
      field: 'main_features',
      message: 'Descreva as principais funcionalidades (mín. 5 caracteres).',
    });
  }

  if (body.budget_available.trim().length < 2) {
    errors.push({
      field: 'budget_available',
      message: 'Informe o orçamento disponível.',
    });
  }

  return errors;
}

export function sanitizeCreateBudget(body: CreateBudgetBody): CreateBudgetBody {
  return {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: formatBrazilianPhone(normalizeBrazilianPhone(body.phone)),
    name_app: body.name_app.trim(),
    description_project: body.description_project.trim(),
    platform: body.platform.trim(),
    delivery_time: body.delivery_time.trim(),
    main_features: body.main_features.trim(),
    budget_available: body.budget_available.trim(),
  };
}
