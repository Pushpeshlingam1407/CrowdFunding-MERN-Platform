import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit-debit', 'upi', 'netbanking', 'wallet'],
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    sparse: true
  }
});

// Add index for better query performance
investmentSchema.index({ project: 1, investor: 1 });
investmentSchema.index({ investor: 1, status: 1 });
investmentSchema.index({ createdAt: -1 });

const Investment = mongoose.model('Investment', investmentSchema);
export default Investment; 