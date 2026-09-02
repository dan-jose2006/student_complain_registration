// Import Express Router to define modular route handlers
import { Router } from 'express';
// Import controller that handles complaint operations (create, list, get, feedback)
import { ComplaintController } from '../controllers/complaint.controller';
// Import authentication middlewares to protect routes and verify student role
import { authenticate, requireStudent } from '../middleware/auth';
// Import request validation middleware utility
import { validate } from '../middleware/validate';
// Import request body schemas for creating a complaint and submitting feedback
import {
  createComplaintSchema,
  submitFeedbackSchema,
} from '../validators/complaint.validator';

// Create a new router instance for complaint endpoints
const router = Router();

// Apply authentication middleware to all routes defined in this router
// Ensures that every incoming request has a valid JWT bearer token
router.use(authenticate);

/**
 * Route: POST /api/complaints
 * Description: Submits a new student complaint
 * Access: Authenticated Students only
 * Middleware: requireStudent checks role, validate validates body against schema
 */
router.post(
  '/',
  requireStudent,
  validate(createComplaintSchema),
  ComplaintController.createComplaint
);

/**
 * Route: GET /api/complaints/my
 * Description: Retrieves all complaints registered by the currently logged-in student
 * Access: Authenticated Students only
 */
router.get('/my', requireStudent, ComplaintController.getMyComplaints);

/**
 * Route: GET /api/complaints/:id
 * Description: Fetches details of a single complaint by its numeric ID
 * Access: Authenticated Users (Students viewing their own, or Admins)
 */
router.get('/:id', ComplaintController.getComplaintById);

/**
 * Route: POST /api/complaints/:id/feedback
 * Description: Submits student rating and feedback for a resolved complaint
 * Access: Authenticated Students only
 * Middleware: validate ensures rating is between 1-5 and comment is valid
 */
router.post(
  '/:id/feedback',
  requireStudent,
  validate(submitFeedbackSchema),
  ComplaintController.submitFeedback
);

// Export router to be mounted at /api/complaints in app.ts
export default router;

