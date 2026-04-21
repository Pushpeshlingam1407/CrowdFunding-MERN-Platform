import express from 'express';
import { createComplaint, getUserComplaints, getAllComplaints } from '../controllers/complaint.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/user', protect, getUserComplaints);
router.get('/admin', protect, admin, getAllComplaints);

export default router;
