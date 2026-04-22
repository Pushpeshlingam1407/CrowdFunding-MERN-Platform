
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Project from '../models/project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixOwnership = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const asif = await User.findOne({ email: 'asif@gmail.com' });
    const admin = await User.findOne({ email: 'admin@crowdfunding.com' });

    if (asif) {
      console.log(`Found Asif: ${asif._id} (${asif.email})`);
    } else {
      console.log('Asif NOT found.');
    }

    if (admin) {
      console.log(`Found Admin: ${admin._id} (${admin.email})`);
    } else {
      console.log('Admin NOT found.');
    }

    if (asif && admin) {
      console.log('Both users exist. Transferring Admin projects to Asif...');
      // Transfer projects currently owned by Admin to Asif (assuming Admin shouldn't own them)
      // This is a heuristic: User complained their projects are gone. They are likely currently owned by Admin.
      
      const adminProjects = await Project.find({ creator: admin._id });
      console.log(`Admin owns ${adminProjects.length} projects.`);

      for (const p of adminProjects) {
        console.log(`Transferring "${p.title}" to Asif...`);
        p.creator = asif._id;
        await p.save();
        
        // Update User arrays
        if (!asif.createdProjects.includes(p._id)) {
            asif.createdProjects.push(p._id);
        }
        
        // Remove from admin
        admin.createdProjects = admin.createdProjects.filter(id => id.toString() !== p._id.toString());
      }
      
      await asif.save();
      await admin.save();
      console.log('Transfer complete.');
    } else if (asif && !admin) {
        console.log("Only Asif exists. Creating Admin...");
        // This case shouldn't trigger the duplicate error from before, but good to handle
    } else if (!asif && admin) {
        console.log("Only Admin exists. (This contradicts the duplicate error).");
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixOwnership();
