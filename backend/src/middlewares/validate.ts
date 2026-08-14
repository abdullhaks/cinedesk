import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpStatusCode } from '../utils/enum';

/**
 * Zod schema-driven request validator middleware.
 * Validates req.body against the provided Zod schema.
 */
export function validate(schema: ZodSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
}
