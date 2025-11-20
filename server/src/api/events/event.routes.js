import express from 'express';
import { body } from 'express-validator';
import { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent,
  joinEvent 
} from './event.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import validate from '../../middleware/validate.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorize('host'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('scheduledAt').isISO8601().withMessage('Valid scheduled time is required'),
    validate
  ], createEvent);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, authorize('host'), updateEvent)
  .delete(protect, authorize('host'), deleteEvent);

router.post('/:id/join', protect, joinEvent);

export default router;
