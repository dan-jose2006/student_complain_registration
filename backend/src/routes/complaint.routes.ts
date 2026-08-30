import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';
import { authenticate, requireStudent } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createComplaintSchema,
  submitFeedbackSchema,
} from '../validators/complaint.validator';

const router = Router();

// All complaint student routes require authentication
router.use(authenticate);

// Student complaint creation and listing
router.post(
  '/',
  requireStudent,
  validate(createComplaintSchema),
  ComplaintController.createComplaint
);

router.get('/my', requireStudent, ComplaintController.getMyComplaints);
router.get('/:id', ComplaintController.getComplaintById);

// Feedback on resolved complaint
router.post(
  '/:id/feedback',
  requireStudent,
  validate(submitFeedbackSchema),
  ComplaintController.submitFeedback
);

export default router;
