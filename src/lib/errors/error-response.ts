import type { ErrorCode } from '@/lib/errors/error-codes.js';

export type FieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  status_code: number;
  code: ErrorCode | string;
  title: string;
  message: string;
  errors?: FieldError[];
  timestamp: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  status_code: number;
  data: T;
};

export function buildSuccessResponse<T>(statusCode: number, data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    status_code: statusCode,
    data,
  };
}

export function buildErrorResponse(params: {
  statusCode: number;
  code: ErrorCode | string;
  title: string;
  message: string;
  errors?: FieldError[];
}): ApiErrorResponse {
  return {
    success: false,
    status_code: params.statusCode,
    code: params.code,
    title: params.title,
    message: params.message,
    errors: params.errors?.length ? params.errors : undefined,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Erros para o front exibir quando a API não responde
 * (rede, timeout, servidor fora do ar).
 */
export const ClientFallbackErrors = {
  network: buildErrorResponse({
    statusCode: 0,
    code: 'NETWORK_ERROR',
    title: 'Sem conexão',
    message: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
  }),
  timeout: buildErrorResponse({
    statusCode: 0,
    code: 'TIMEOUT_ERROR',
    title: 'Tempo esgotado',
    message: 'O servidor demorou para responder. Tente novamente em instantes.',
  }),
  serverUnavailable: buildErrorResponse({
    statusCode: 503,
    code: 'SERVICE_UNAVAILABLE',
    title: 'Serviço indisponível',
    message: 'Nossos serviços estão temporariamente indisponíveis. Tente novamente em alguns minutos.',
  }),
} as const;
