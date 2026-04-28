import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getAllComplaints,
  assignComplaint,
  updateStatus,
  getDashboard,
  getAdmins,
  getCategories,
  complainUpdate,
} from '../controllers/adminController';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', complainUpdate);
router.patch('/complaints/:id/status', updateStatus);
router.get('/dashboard', getDashboard);
router.get('/admins', getAdmins);
router.get('/categories', getCategories);

export default router;
