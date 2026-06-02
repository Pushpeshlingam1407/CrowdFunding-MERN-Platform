
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const debugUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Total Users: ${users.length}`);

    users.forEach(u => {
      console.log('--------------------------------------------------');
      console.log(`ID: ${u._id}`);
      console.log(`Name: ${u.name}`);
      console.log(`Email: ${u.email}`);
      console.log(`Role: ${u.role}`);
      console.log(`IsAdmin: ${u.isAdmin}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugUsers();
