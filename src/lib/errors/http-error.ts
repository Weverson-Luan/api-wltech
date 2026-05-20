import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import type { FieldError } from '@/lib/errors/error-response.js';

export function failValidation(message: string, errors: FieldError[], title = 'Dados inválidos') {
  throw new AppError(400, message, ErrorCodes.VALIDATION_ERROR, title, errors);
}

export function failUnauthorized(
  message = 'Sessão expirada ou token inválido. Faça login novamente.',
) {
  throw new AppError(401, message, ErrorCodes.UNAUTHORIZED, 'Não autorizado');
}

export function failForbidden(
  message = 'Você não tem permissão para acessar este recurso.',
) {
  throw new AppError(403, message, ErrorCodes.FORBIDDEN, 'Acesso negado');
}

export function failNotFound(message = 'Recurso não encontrado.') {
  throw new AppError(404, message, ErrorCodes.NOT_FOUND, 'Não encontrado');
}

export function failServiceUnavailable(
  message = 'Serviço temporariamente indisponível. Tente novamente em instantes.',
) {
  throw new AppError(503, message, ErrorCodes.SERVICE_UNAVAILABLE, 'Serviço indisponível');
}
