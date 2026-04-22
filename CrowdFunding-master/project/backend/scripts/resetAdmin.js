
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@crowdfunding.com';
    const password = 'SecurePassword123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        isAdmin: true
      },
      { upsert: true, new: true }
    );

    console.log(`Admin user ${email} reset successfully.`);
    console.log(`Password set to: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin();
