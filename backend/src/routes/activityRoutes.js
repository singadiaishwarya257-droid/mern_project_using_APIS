import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getActivities, getActivityById, createActivity, updateActivity, deleteActivity, searchActivities } from '../controllers/activityController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'user'), getActivities);
router.get('/search', authorize('admin', 'manager', 'user'), searchActivities);
router.get('/:id', authorize('admin', 'manager', 'user'), getActivityById);
router.post('/', authorize('admin', 'manager'), createActivity);
router.put('/:id', authorize('admin', 'manager'), updateActivity);
router.delete('/:id', authorize('admin', 'manager'), deleteActivity);
export default router;
