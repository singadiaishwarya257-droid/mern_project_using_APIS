import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/roleController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin'), getRoles);
router.get('/:id', authorize('admin'), getRoleById);
router.post('/', authorize('admin'), createRole);
router.put('/:id', authorize('admin'), updateRole);
router.delete('/:id', authorize('admin'), deleteRole);
export default router;
