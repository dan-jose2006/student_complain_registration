// Import Express Request, Response, and NextFunction types
import { Request, Response, NextFunction } from 'express';
// Import authentication business logic service
import { AuthService } from '../services/auth.service';
// Import standardized API response builder
import { ApiResponse } from '../utils/response';
// Import typed AuthenticatedRequest that carries the decoded JWT user token
import { AuthenticatedRequest } from '../types';

/**
 * AuthController
 * Handles user registration, credentials authentication, and profile retrieval.
 */
export class AuthController {
  /**
   * Handles POST /api/auth/register
   * Registers a new student or admin account and issues an authentication token.
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Delegate registration to AuthService passing the validated request body
      const result = await AuthService.register(req.body);
      // Respond with HTTP 201 Created containing user data and JWT token
      ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (error) {
      // Pass any errors (e.g. duplicate email) to global error handler
      next(error);
    }
  }

  /**
   * Handles POST /api/auth/login
   * Validates credentials and returns JWT bearer token on success.
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Authenticate credentials through AuthService
      const result = await AuthService.login(req.body);
      // Respond with HTTP 200 OK containing user object and JWT token
      ApiResponse.success(res, result, 'Login successful', 200);
    } catch (error) {
      // Forward authentication failure error to global middleware
      next(error);
    }
  }

  /**
   * Handles GET /api/auth/me
   * Fetches full profile information of the currently authenticated user.
   */
  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Guard check: verify user token was decoded by authenticate middleware
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      // Look up user profile from database by ID
      const user = await AuthService.getProfile(req.user.userId);
      // Respond with HTTP 200 OK and user details
      ApiResponse.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      // Forward database or lookup errors
      next(error);
    }
  }
}

