
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Project from '../models/project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const debugProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@crowdfunding.com';
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('Admin user not found!');
    } else {
      console.log(`Admin ID: ${admin._id}`);
      console.log(`Admin Name: ${admin.name}`);
      console.log(`Admin Created Projects (in User doc):`, admin.createdProjects);
    }

    const projects = await Project.find({});
    console.log(`\nTotal Projects in DB: ${projects.length}`);
    
    projects.forEach(p => {
      console.log(`- Project: ${p.title} (ID: ${p._id})`);
      console.log(`  Creator ID: ${p.creator}`);
      if (admin && p.creator.toString() === admin._id.toString()) {
        console.log('  -> MATCHES ADMIN ID');
      } else {
        console.log('  -> Does NOT match Admin ID');
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugProjects();
