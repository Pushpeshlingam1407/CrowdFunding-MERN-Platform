import express from 'express';
import { createReview, getCompanyReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/company/:companyId', protect, getCompanyReviews);

export default router;
