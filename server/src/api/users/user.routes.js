import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from './user.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import validate from '../../middleware/validate.middleware.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], login);

router.get('/me', protect, getMe);

export default router;
