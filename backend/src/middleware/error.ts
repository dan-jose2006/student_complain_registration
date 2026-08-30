import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle specific known error types
  if (err.name === 'UnauthorizedError') {
    ApiResponse.error(res, 'Unauthorized access', 401);
    return;
  }

  if (err.name === 'ForbiddenError') {
    ApiResponse.error(res, 'Forbidden access', 403);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  ApiResponse.error(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.error(res, `API route not found: ${req.method} ${req.originalUrl}`, 404);
};
