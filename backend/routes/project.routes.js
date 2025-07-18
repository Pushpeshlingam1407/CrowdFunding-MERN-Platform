import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
  createProject, 
  getAllProjects, 
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject 
} from '../controllers/project.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected routes
router.use(protect);
router.get('/user/projects', getUserProjects);
// router.post('/', upload.single('image'), createProject);
router.post('/createproject', createProject);

router.put('/:id', upload.single('image'), updateProject);
router.delete('/:id', deleteProject);

export default router; 