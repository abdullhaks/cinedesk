import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { HttpStatusCode } from '../utils/enum';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
    return;
  }

  console.error('Unhandled error details:', err);

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
    errorDetails: process.env.NODE_ENV !== 'production' ? err.message : undefined,
  });
};
