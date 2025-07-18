import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id: id || 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// Format auth response
const formatAuthResponse = (user, token) => {
  return {
    success: true,
    token: `Bearer ${token}`,
    user: {
      id: user._id || 'admin',
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'individual' } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    // Create user (let the model handle hashing)
  const user = await User.create({
    name,
    email,
    password, // plain password, will be hashed by pre-save hook
    role,
    isVerified: true
  });

    // Generate token
    const token = generateToken(user._id);

    // Emit new user event for real-time updates
    const io = req.app.get('io');
    io.emit('userCreated', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    });

    // Send response
    res.status(201).json(formatAuthResponse(user, token));
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin credentials
    if (email === 'asifadmin@gmail.com' && password === 'asif123@') {
      const token = generateToken();
      return res.json(formatAuthResponse({
        name: 'Admin',
        email: 'asifadmin@gmail.com',
        role: 'admin'
      }, token));
    }

    // For non-admin users, continue with regular login
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);
    res.json(formatAuthResponse(user, token));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    // Check if it's the admin user
    if (req.user.role === 'admin') {
      return res.json({
        success: true,
        user: {
          id: 'admin',
          name: 'Admin',
          email: 'asifadmin@gmail.com',
          role: 'admin',
          isVerified: true
        }
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};
