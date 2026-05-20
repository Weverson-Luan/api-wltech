import type { FastifyError, FastifyInstance, FastifyReply } from 'fastify';
import { AppError } from '@/lib/errors/app-error.js';
import { ErrorCodes } from '@/lib/errors/error-codes.js';
import { buildErrorResponse } from '@/lib/errors/error-response.js';
import { mapFastifyValidation } from '@/lib/errors/map-fastify-validation.js';

function sendError(reply: FastifyReply, payload: ReturnType<typeof buildErrorResponse>) {
  return reply.status(payload.status_code).send(payload);
}

function handleFastifyError(error: FastifyError) {
  if (error.validation?.length) {
    return buildErrorResponse({
      statusCode: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      title: 'Dados inválidos',
      message: 'Verifique os campos informados e tente novamente.',
      errors: mapFastifyValidation(error.validation),
    });
  }

  if (error.code === 'FST_ERR_CTP_INVALID_JSON_BODY') {
    return buildErrorResponse({
      statusCode: 400,
      code: ErrorCodes.BAD_REQUEST,
      title: 'Requisição inválida',
      message: 'O corpo da requisição não é um JSON válido.',
    });
  }

  if (error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
    return buildErrorResponse({
      statusCode: 400,
      code: ErrorCodes.BAD_REQUEST,
      title: 'Requisição inválida',
      message: 'O corpo da requisição está vazio.',
    });
  }

  if (
    error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
    error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' ||
    error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED'
  ) {
    const expired = error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED';

    return buildErrorResponse({
      statusCode: 401,
      code: ErrorCodes.UNAUTHORIZED,
      title: 'Não autorizado',
      message: expired
        ? 'Sua sessão expirou. Faça login novamente.'
        : 'Token inválido ou ausente. Faça login novamente.',
    });
  }

  return null;
}

export async function registerErrorHandler(app: FastifyInstance) {
  app.setNotFoundHandler((_request, reply) => {
    return sendError(
      reply,
      buildErrorResponse({
        statusCode: 404,
        code: ErrorCodes.NOT_FOUND,
        title: 'Rota não encontrada',
        message: 'O endereço solicitado não existe.',
      }),
    );
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return sendError(
        reply,
        buildErrorResponse({
          statusCode: error.statusCode,
          code: error.code,
          title: error.title,
          message: error.message,
          errors: error.errors,
        }),
      );
    }

    const fastifyError = handleFastifyError(error as FastifyError);
    if (fastifyError) {
      return sendError(reply, fastifyError);
    }

    request.log.error(error);

    return sendError(
      reply,
      buildErrorResponse({
        statusCode: 500,
        code: ErrorCodes.INTERNAL_ERROR,
        title: 'Erro interno',
        message: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
      }),
    );
  });
}
