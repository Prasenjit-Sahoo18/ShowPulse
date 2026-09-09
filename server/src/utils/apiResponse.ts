import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export function sendSuccess<T>(
  res: Response,
  message: string = 'Success',
  data?: T,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 400,
  error?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error ? { error } : {}),
  });
}
