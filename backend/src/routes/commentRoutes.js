import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getComments, getCommentById, createComment, updateComment, deleteComment, searchComments } from '../controllers/commentController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'user'), getComments);
router.get('/search', authorize('admin', 'manager', 'user'), searchComments);
router.get('/:id', authorize('admin', 'manager', 'user'), getCommentById);
router.post('/', authorize('admin', 'manager', 'user'), createComment);
router.put('/:id', authorize('admin', 'manager', 'user'), updateComment);
router.delete('/:id', authorize('admin', 'manager'), deleteComment);
export default router;
