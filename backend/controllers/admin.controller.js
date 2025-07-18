import User from '../models/User.js';
import Project from '../models/Project.js';
import Investment from '../models/Investment.js';
import fs from 'fs';
import path from 'path';

/**
 * Retrieves statistics and data for the admin dashboard
 * @async
 * @function getDashboardStats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns dashboard statistics and recent activity
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const [userCount, projectCount, investmentCount] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Investment.countDocuments()
    ]);

    // Get recent projects
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('creator', 'name email');

    // Get recent investments
    const recentInvestments = await Investment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('investor', 'name email')
      .populate('project', 'title');

    // Get total funds raised
    const totalFunds = await Investment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get project status counts
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      counts: {
        users: userCount,
        projects: projectCount,
        investments: investmentCount,
        totalFunds: totalFunds[0]?.total || 0
      },
      projectStats: projectStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentActivity: {
        projects: recentProjects,
        investments: recentInvestments
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

/**
 * Updates a project's details and status
 * @async
 * @function updateProject
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Project ID
 * @param {Object} req.body - Project update data
 * @param {Object} res - Express response object
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, ...updateData } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project fields
    Object.assign(project, updateData);
    
    // Update review-related fields if status is provided
    if (status) {
      project.status = status;
      project.feedback = feedback;
      project.reviewedAt = Date.now();
      project.reviewedBy = req.user._id;
    }

    await project.save();

    // Populate creator info before sending response
    await project.populate('creator', 'name email');

    // Emit project update event
    const io = req.app.get('io');
    io.emit('projectUpdated', {
      projectId: project._id,
      status: project.status,
      feedback: project.feedback
    });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

/**
 * Updates a user's status
 * @async
 * @function updateUserStatus
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID
 * @param {Object} req.body - Contains status and optional reason
 * @param {Object} res - Express response object
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent updating admin status
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot update admin status' });
    }

    user.status = status;
    user.statusReason = reason;
    user.statusUpdatedAt = Date.now();
    user.statusUpdatedBy = req.user._id;

    await user.save();

    // Emit user update event
    const io = req.app.get('io');
    io.emit('userUpdated', {
      userId: user._id,
      status: user.status,
      reason: user.statusReason
    });

    res.json(user);
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

/**
 * Retrieves all users in the system
 * @async
 * @function getAllUsers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/**
 * Retrieves all projects
 * @async
 * @function getAllProjects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

/**
 * Deletes a project and its associated data
 * @async
 * @function deleteProject
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Project ID
 * @param {Object} res - Express response object
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated investments
    await Investment.deleteMany({ project: id });

    // Delete project image if it exists
    if (project.image) {
      const imagePath = path.join(process.cwd(), '..', 'uploads', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the project
    await project.deleteOne();

    // Emit project deletion event
    const io = req.app.get('io');
    io.emit('projectDeleted', {
      projectId: id,
      message: 'Project has been deleted'
    });

    res.json({ 
      success: true, 
      message: 'Project and associated data deleted successfully' 
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
}; 