import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ApiResponse.success(res, result, 'Login successful', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      const user = await AuthService.getProfile(req.user.userId);
      ApiResponse.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
