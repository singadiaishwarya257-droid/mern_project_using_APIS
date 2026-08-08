import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getSettings, getSettingById, updateSetting, searchSettings } from '../controllers/settingController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager'), getSettings);
router.get('/search', authorize('admin', 'manager'), searchSettings);
router.get('/:id', authorize('admin', 'manager'), getSettingById);
router.put('/:id', authorize('admin', 'manager'), updateSetting);
export default router;
