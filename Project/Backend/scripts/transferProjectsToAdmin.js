
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Project from '../models/project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const transferProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@crowdfunding.com';
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('Admin user not found!');
      process.exit(1);
    }

    // Find projects that are NOT owned by admin
    const projects = await Project.find({ creator: { $ne: admin._id } });
    console.log(`Found ${projects.length} projects not owned by Admin.`);

    if (projects.length === 0) {
      console.log('No projects to transfer.');
      process.exit(0);
    }

    for (const project of projects) {
      // Update project creator
      project.creator = admin._id;
      await project.save();
      console.log(`Transferred project "${project.title}" to Admin.`);

      // Add to admin's createdProjects if not already there
      if (!admin.createdProjects.includes(project._id)) {
        admin.createdProjects.push(project._id);
      }
    }

    await admin.save();
    console.log('Admin user updated with new projects.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

transferProjects();
