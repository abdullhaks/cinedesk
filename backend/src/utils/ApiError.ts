import { HttpStatusCode } from './enum';

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'ERROR';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(HttpStatusCode.BAD_REQUEST, message, 'BAD_REQUEST');
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(HttpStatusCode.UNAUTHORIZED, message, 'UNAUTHORIZED');
  }

  static forbidden(message: string): ApiError {
    return new ApiError(HttpStatusCode.FORBIDDEN, message, 'FORBIDDEN');
  }

  static notFound(message: string): ApiError {
    return new ApiError(HttpStatusCode.NOT_FOUND, message, 'NOT_FOUND');
  }

  static conflict(message: string): ApiError {
    return new ApiError(HttpStatusCode.CONFLICT, message, 'CONFLICT');
  }

  static internal(message: string): ApiError {
    return new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR');
  }
}
