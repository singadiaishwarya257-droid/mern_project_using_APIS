import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam, searchTeams } from '../controllers/teamController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'user'), getTeams);
router.get('/search', authorize('admin', 'manager', 'user'), searchTeams);
router.get('/:id', authorize('admin', 'manager', 'user'), getTeamById);
router.post('/', authorize('admin', 'manager'), createTeam);
router.put('/:id', authorize('admin', 'manager'), updateTeam);
router.delete('/:id', authorize('admin', 'manager'), deleteTeam);
export default router;
