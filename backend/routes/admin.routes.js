import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

// Apply both authentication and admin middleware to all routes
router.use(protect, isAdmin);

// Admin dashboard routes
router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/projects', adminController.getAllProjects);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);
router.put('/users/:id/status', adminController.updateUserStatus);

export default router;