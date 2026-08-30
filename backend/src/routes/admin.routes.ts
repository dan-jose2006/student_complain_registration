import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateComplaintStatusSchema } from '../validators/complaint.validator';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate, requireAdmin);

router.get('/dashboard', AdminController.getDashboard);
router.get('/complaints', AdminController.getAllComplaints);
router.get('/complaints/:id', AdminController.getComplaintById);
router.patch(
  '/complaints/:id',
  validate(updateComplaintStatusSchema),
  AdminController.updateComplaint
);

export default router;
