import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Handle admin user case
    if (decoded.id === 'admin') {
      req.user = {
        id: 'admin',
        role: 'admin'
      };
      return next();
    }

    // For regular users
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

export const creator = (req, res, next) => {
  if (req.user && (req.user.role === 'creator' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as creator'
    });
  }
};
