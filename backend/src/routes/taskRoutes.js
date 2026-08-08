import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getTasks, getTaskById, createTask, updateTask, deleteTask, searchTasks } from '../controllers/taskController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'user'), getTasks);
router.get('/search', authorize('admin', 'manager', 'user'), searchTasks);
router.get('/:id', authorize('admin', 'manager', 'user'), getTaskById);
router.post('/', authorize('admin', 'manager'), createTask);
router.put('/:id', authorize('admin', 'manager'), updateTask);
router.delete('/:id', authorize('admin', 'manager'), deleteTask);
export default router;
