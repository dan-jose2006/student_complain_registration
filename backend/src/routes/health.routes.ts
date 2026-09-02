// Import Express Router, Request, and Response types
import { Router, Request, Response } from 'express';
// Import unified JSON response formatter utility
import { ApiResponse } from '../utils/response';

// Create a new router instance for health inspection
const router = Router();

/**
 * Route: GET /api/health
 * Description: Health probe endpoint used by monitoring services, cloud platforms, and status dashboards
 * Access: Public (no authentication required)
 */
router.get('/', (req: Request, res: Response) => {
  // Respond with HTTP 200 and system uptime/status information
  ApiResponse.success(
    res,
    {
      status: 'healthy',                          // Service health indicator
      service: 'CampusCare API',                  // Application name
      timestamp: new Date().toISOString(),        // Server timestamp in UTC
      uptime: process.uptime(),                   // Server process uptime in seconds
    },
    'CampusCare Backend API is running smoothly'  // Human-readable message
  );
});

// Export router to be mounted at /api/health in app.ts
export default router;

