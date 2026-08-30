import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiResponse } from '../utils/response';
import { AuthenticatedRequest, UserRole } from '../types';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.error(res, 'Authentication token required. Please log in.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    ApiResponse.error(res, 'Invalid or expired session token. Please log in again.', 401);
    return;
  }
};

export const requireRole = (role: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 'Authentication required', 401);
      return;
    }

    if (req.user.role !== role) {
      ApiResponse.error(
        res,
        `Forbidden: Access restricted to ${role.toLowerCase()}s only.`,
        403
      );
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
export const requireStudent = requireRole('STUDENT');
