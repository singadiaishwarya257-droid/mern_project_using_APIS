import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getTags, getTagById, createTag, updateTag, deleteTag, searchTags } from '../controllers/tagController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'user'), getTags);
router.get('/search', authorize('admin', 'manager', 'user'), searchTags);
router.get('/:id', authorize('admin', 'manager', 'user'), getTagById);
router.post('/', authorize('admin', 'manager'), createTag);
router.put('/:id', authorize('admin', 'manager'), updateTag);
router.delete('/:id', authorize('admin', 'manager'), deleteTag);
export default router;
