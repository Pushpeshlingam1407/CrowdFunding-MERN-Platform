import express from 'express';
import { register, login, getProfile, getCurrentUser, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router; 