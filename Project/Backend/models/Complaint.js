import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bug', 'fraud', 'unpaid', 'other'],
    default: 'bug'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  screenshot: {
    type: String // URL from Firebase Storage
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'dismissed'],
    default: 'pending'
  },
  targetCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
