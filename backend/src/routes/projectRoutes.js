import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getProjects, getProjectById, createProject, updateProject, deleteProject, searchProjects } from '../controllers/projectController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'user'), getProjects);
router.get('/search', authorize('admin', 'manager', 'user'), searchProjects);
router.get('/:id', authorize('admin', 'manager', 'user'), getProjectById);
router.post('/', authorize('admin', 'manager'), createProject);
router.put('/:id', authorize('admin', 'manager'), updateProject);
router.delete('/:id', authorize('admin', 'manager'), deleteProject);
export default router;
