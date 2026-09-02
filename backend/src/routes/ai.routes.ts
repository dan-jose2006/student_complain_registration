// Import Express Router for AI route handling
import { Router } from 'express';
// Import AI controller handling LLM complaint triage, description rewriting, and analytics
import { AIController } from '../controllers/ai.controller';
// Import authentication and role enforcement middlewares
import { authenticate, requireAdmin } from '../middleware/auth';
// Import schema validator middleware
import { validate } from '../middleware/validate';
// Import Zod validation schemas for AI input requests
import { analyzeComplaintSchema, reframeDescriptionSchema } from '../validators/ai.validator';

// Create a new router instance for AI capabilities
const router = Router();

// Require authentication for all AI endpoints (valid JWT required)
router.use(authenticate);

/**
 * Route: POST /api/ai/analyze-complaint
 * Description: Analyzes a student's complaint text to auto-classify category, priority, department, and summary
 * Middleware: validate(analyzeComplaintSchema) verifies title and description inputs
 */
router.post(
  '/analyze-complaint',
  validate(analyzeComplaintSchema),
  AIController.analyzeComplaint
);

/**
 * Route: POST /api/ai/reframe-description
 * Description: Uses LLM to polish and rephrase an informal complaint description into clear, professional wording
 * Middleware: validate(reframeDescriptionSchema) verifies text input length and presence
 */
router.post(
  '/reframe-description',
  validate(reframeDescriptionSchema),
  AIController.reframeDescription
);

/**
 * Route: POST /api/ai/admin-insights
 * Description: Synthesizes high-level actionable strategic insights and preventative maintenance recommendations
 * Access: Authenticated Administrators only (enforced by requireAdmin)
 */
router.post('/admin-insights', requireAdmin, AIController.getAdminInsights);

// Export router to be mounted at /api/ai in app.ts
export default router;

