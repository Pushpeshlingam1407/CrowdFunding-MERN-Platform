import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['startup', 'investor', 'mnc', 'employee', 'admin'],
    default: 'startup'
  },
  companyName: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  services: [{
    type: String
  }],
  stars: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }],
  personalPortfolio: [{
    title: String,
    description: String,
    link: String,
    image: String,
    date: Date
  }],
  partnerHistory: [{
    name: String,
    logo: String,
    profileId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
