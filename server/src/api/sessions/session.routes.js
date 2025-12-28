import express from 'express';
import { getAgoraToken, startSession, endSession, getSessionStatus } from './session.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:eventId/token', protect, getAgoraToken);
router.get('/:eventId/status', protect, getSessionStatus);
router.post('/start', protect, startSession);
router.put('/:id/end', protect, endSession);

export default router;
