// Import Express Router for creating modular route paths
import { Router } from 'express';
// Import controller with user registration, login, and current-user logic
import { AuthController } from '../controllers/auth.controller';
// Import request validation middleware utility
import { validate } from '../middleware/validate';
// Import authentication middleware to extract and verify JWT tokens
import { authenticate } from '../middleware/auth';
// Import schemas for validating registration and login request payloads
import { registerSchema, loginSchema } from '../validators/auth.validator';

// Create a new router instance for authentication endpoints
const router = Router();

/**
 * Route: POST /api/auth/register
 * Description: Registers a new user account (student or admin)
 * Middleware: validate(registerSchema) validates email, password, name, and role
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * Route: POST /api/auth/login
 * Description: Authenticates user credentials and returns JWT bearer token
 * Middleware: validate(loginSchema) verifies valid email format and password presence
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * Route: GET /api/auth/me
 * Description: Returns profile information of the currently authenticated user
 * Middleware: authenticate ensures caller presents a valid JWT token
 */
router.get('/me', authenticate, AuthController.getMe);

// Export router to be mounted at /api/auth
export default router;

