import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Investment from '../models/Investment.js';

const router = express.Router();

// @route   GET /api/users/stats
// @desc    Get user's statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const [investments, projects] = await Promise.all([
      Investment.find({ investor: req.user._id }),
      Project.find({ creator: req.user._id })
    ]);

    const stats = {
      totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
      activeInvestments: investments.filter(inv => inv.status === 'active').length,
      totalReturns: investments.reduce((sum, inv) => sum + (inv.returns || 0), 0),
      pendingProjects: projects.filter(proj => proj.status === 'pending').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

export default router; 