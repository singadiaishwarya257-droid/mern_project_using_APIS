import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getUsers, getUserById, updateUser, deleteUser, searchUsers } from '../controllers/userController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager'), getUsers);
router.get('/search', authorize('admin', 'manager'), searchUsers);
router.get('/:id', authorize('admin', 'manager', 'user'), getUserById);
router.put('/:id', authorize('admin', 'manager', 'user'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
export default router;
