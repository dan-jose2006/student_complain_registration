import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { analyzeComplaintSchema } from '../validators/ai.validator';

const router = Router();

// Require authentication for AI endpoints
router.use(authenticate);

// Student/User issue triage
router.post(
  '/analyze-complaint',
  validate(analyzeComplaintSchema),
  AIController.analyzeComplaint
);

// Admin-only strategic campus insights
router.post('/admin-insights', requireAdmin, AIController.getAdminInsights);

export default router;
