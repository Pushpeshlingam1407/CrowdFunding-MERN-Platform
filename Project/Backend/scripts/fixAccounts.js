
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Find the current "Admin" user who is actually Asif
    const overwrittenUser = await User.findOne({ email: 'admin@crowdfunding.com' });

    if (!overwrittenUser) {
      console.log('No user found with admin email. Creating fresh admin...');
    } else {
      console.log(`Found overwritten user: ${overwrittenUser.name} (${overwrittenUser._id})`);
      
      // Restore this user to Asif
      overwrittenUser.email = 'asif@gmail.com';
      overwrittenUser.name = 'Asif Shaik';
      overwrittenUser.role = 'individual'; // Assuming individual
      overwrittenUser.isAdmin = false;
      
      // We must reset password because we overwrote it. 
      // User will have to use this temporary one.
      const salt = await bcrypt.genSalt(10);
      overwrittenUser.password = await bcrypt.hash('Password123!', salt);

      await overwrittenUser.save();
      console.log('Restored Asif Shaik account (Email: asif@gmail.com, Pass: Password123!)');
    }

    // 2. Create the ACTUAL Admin account
    const adminEmail = 'admin@crowdfunding.com';
    const adminPassword = 'SecurePassword123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Ensure no conflict (though we just renamed the conflicting one)
    await User.findOneAndDelete({ email: adminEmail });

    const newAdmin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isAdmin: true,
      isVerified: true
    });

    console.log(`Created new Admin account (Email: ${adminEmail}, ID: ${newAdmin._id})`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing accounts:', error);
    process.exit(1);
  }
};

fixAccounts();
