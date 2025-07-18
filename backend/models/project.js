import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  equity: {
    type: Number,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Healthcare', 'Environment', 'Technology', 'Social', 'Other']
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Add index for better query performance
projectSchema.index({ status: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);
export default Project; 