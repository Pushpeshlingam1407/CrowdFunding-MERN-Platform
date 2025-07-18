import Project from '../models/Project.js';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projects');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (ext && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Create new project
// export const createProject = async (req, res) => {
//       const {}
//   try {
//     // Always return success
//     res.status(201).json({ 
//       success: true,
//       message: 'Project created successfully! Please check dashboard.'
//     });
//   } catch (error) {
//     console.error('Error creating project:', error);
//     res.status(500).json({ message: 'Error creating project', error: error.message });
//   }
// };


// Create a new project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetAmount,
      startDate,
      endDate,
      image,
      equity,
    } = req.body;

    const creator = req.user._id; // Assuming auth middleware sets req.user

    const newProject = new Project({
      title,
      description,
      category,
      targetAmount,
      startDate,
      endDate,
      image,
      creator,
      equity
    });

    await newProject.save();
    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Get user's projects
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user._id })
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching user projects' });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    res.status(500).json({ message: 'Error fetching project' });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, status } = req.body;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    // Find project and check existence
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Prepare update data
    const updateData = {
      title: title?.trim() || project.title,
      description: description?.trim() || project.description,
      category: category?.trim() || project.category,
      status: status || project.status
    };

    // Handle image update if new file is provided
    if (req.file) {
      // Validate new image size
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size should not exceed 5MB' });
      }
      updateData.image = `/uploads/projects/${req.file.filename}`;
      
      // Delete old image if it exists
      const oldImagePath = path.join(__dirname, '..', 'public', project.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('creator', 'name email');

    // Emit update event
    const io = req.app.get('io');
    io.emit('projectUpdated', updatedProject);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating project', 
      error: error.message 
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is authorized to delete
    if (!project.creator || !req.user._id) {
      return res.status(403).json({ success: false, message: 'Invalid project or user data' });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    
    // Emit socket event for real-time update
    req.app.get('io').emit('projectDeleted', req.params.id);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Error deleting project' });
  }
}; 