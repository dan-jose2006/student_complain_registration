// Import Express Router for administrative routes
import { Router } from 'express';
// Import controller that handles administrative operations (metrics, filtering, status updates)
import { AdminController } from '../controllers/admin.controller';
// Import authentication and role-checking middlewares
import { authenticate, requireAdmin } from '../middleware/auth';
// Import request validation utility
import { validate } from '../middleware/validate';
// Import request schema for updating complaint status and priority
import { updateComplaintStatusSchema } from '../validators/complaint.validator';

// Create a new router instance for admin operations
const router = Router();

// Apply authentication and admin role requirement to all routes in this file
// Rejects any unauthenticated user or any user whose role is not 'ADMIN'
router.use(authenticate, requireAdmin);

/**
 * Route: GET /api/admin/dashboard
 * Description: Retrieves high-level analytics, KPI metrics, chart distributions, and recent complaints
 */
router.get('/dashboard', AdminController.getDashboard);

/**
 * Route: GET /api/admin/complaints
 * Description: Retrieves complaints list with optional query filter parameters (search, status, category, priority)
 */
router.get('/complaints', AdminController.getAllComplaints);

/**
 * Route: GET /api/admin/complaints/:id
 * Description: Retrieves full details of a specific complaint by ID
 */
router.get('/complaints/:id', AdminController.getComplaintById);

/**
 * Route: PATCH /api/admin/complaints/:id
 * Description: Updates the status (PENDING, IN_PROGRESS, RESOLVED) or priority of a complaint
 * Middleware: validate ensures status and priority conform to valid enum values
 */
router.patch(
  '/complaints/:id',
  validate(updateComplaintStatusSchema),
  AdminController.updateComplaint
);

// Export router to be mounted at /api/admin in app.ts
export default router;

