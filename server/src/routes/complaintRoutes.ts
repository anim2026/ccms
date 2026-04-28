import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController';
import { getCategories } from '../controllers/adminController';

const router = Router();

router.use(authenticate);
router.get('/categories', getCategories);
router.post('/', createComplaint);
router.get('/my', getMyComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

export default router;
