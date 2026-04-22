import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: String,
  website: String,
  bio: {
    type: String,
    maxLength: 1000
  },
  industry: [String],
  location: String,
  foundedDate: Date,
  teamSize: String,
  branding: {
    logo: String,
    primaryColor: {
      type: String,
      default: '#0077b6'
    },
    slogan: String
  },
  visibilitySettings: {
    showPortfolio: { type: Boolean, default: true },
    showMetrics: { type: Boolean, default: true },
    showJourney: { type: Boolean, default: true }
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
  portfolio: [{
    title: String,
    description: String,
    link: String,
    image: String,
    clientName: String,
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
  activityLog: [{
    milestone: String,
    type: { type: String, enum: ['automatic', 'manual'], default: 'manual' },
    date: { type: Date, default: Date.now }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;
