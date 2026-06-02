import express from 'express';
import { getCompanies, getCompanyById, updateCompany } from '../controllers/company.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/', protect, updateCompany);

export default router;
