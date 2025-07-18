import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['investor', 'creator'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Document = mongoose.model('Document', DocumentSchema);
export default Document; 