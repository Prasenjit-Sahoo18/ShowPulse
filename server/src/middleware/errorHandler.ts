import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Unhandled API Error:', err);

  // Zod schema validation errors
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return sendError(res, `Validation error: ${messages}`, 400, err.errors);
  }

  // Prisma unique constraint violation
  if (err?.code === 'P2002') {
    const fields = (err.meta?.target as string[]) || [];
    return sendError(res, `Unique constraint failed on field(s): ${fields.join(', ')}`, 409);
  }

  // Prisma record not found
  if (err?.code === 'P2025') {
    return sendError(res, 'Requested resource not found.', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
}
