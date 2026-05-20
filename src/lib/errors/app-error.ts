import type { FieldError } from '@/lib/errors/error-response.js';
import type { ErrorCode } from '@/lib/errors/error-codes.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: ErrorCode | string,
    public readonly title: string,
    public readonly errors?: FieldError[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}
