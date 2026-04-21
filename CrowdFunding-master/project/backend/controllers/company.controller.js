import Company from '../models/Company.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Investment from '../models/Investment.js';
import Project from '../models/project.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate('user', 'name email role');
  res.json(companies);
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = asyncHandler(async (req, res) => {
  let company = await Company.findById(req.params.id).populate('user', 'name email role companyName companyWebsite');
  
  if (!company) {
    company = await Company.findOne({ user: req.params.id }).populate('user', 'name email role companyName companyWebsite');
  }

  if (company) {
    // Derive Dynamic Trust Metrics
    const userProjects = await Project.find({ creator: company.user._id });
    const projectIds = userProjects.map(p => p._id);
    
    const uniqueInvestors = await Investment.distinct('investor', { 
        project: { $in: projectIds },
        status: 'approved' 
    });

    const collaborationsCount = await Investment.countDocuments({ 
        project: { $in: projectIds },
        status: 'approved'
    });

    // Add dynamic metrics to the response (not saved to DB to keep it fresh)
    const companyData = company.toObject();
    companyData.dynamicMetrics = {
        trustedByCount: uniqueInvestors.length,
        collaborationsCount: collaborationsCount,
        projectsCount: userProjects.length
    };

    res.json(companyData);
  } else {
    // If not found by Company ID, try finding by User ID (initial setup)
    const companyByUser = await Company.findOne({ user: req.params.id }).populate('user', 'name email role');
    if (companyByUser) {
      return res.json(companyByUser);
    }
    
    // If absolutely not found, create a placeholder for the user profile
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User/Company not found');
    }

    const placeholderCompany = await Company.create({
        user: user._id,
        name: user.name,
        bio: `Professional B2B space for ${user.name}`,
        activityLog: [{ milestone: 'Official Platform Onboarding', type: 'automatic', date: user.createdAt }]
    });
    
    const populated = await Company.findById(placeholderCompany._id).populate('user', 'name email role');
    res.json(populated);
  }
});

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private
export const updateCompany = asyncHandler(async (req, res) => {
  let company = await Company.findOne({ user: req.user._id });

  if (!company) {
    company = new Company({ user: req.user._id, name: req.user.name });
  }

  // Update branding
  if (req.body.branding) {
    company.branding = {
      ...company.branding,
      ...req.body.branding
    };
  }

  // Update visibility
  if (req.body.visibilitySettings) {
    company.visibilitySettings = {
      ...company.visibilitySettings,
      ...req.body.visibilitySettings
    };
  }

  // Update main fields
  company.name = req.body.name || company.name;
  company.website = req.body.website || company.website;
  company.bio = req.body.bio || company.bio;
  company.industry = req.body.industry || company.industry;
  company.location = req.body.location || company.location;
  company.teamSize = req.body.teamSize || company.teamSize;
  company.socialLinks = req.body.socialLinks || company.socialLinks;
  
  // Handle portfolio items
  if (req.body.portfolio) {
    company.portfolio = req.body.portfolio;
  }

  // Handle partner history
  if (req.body.partnerHistory) {
    company.partnerHistory = req.body.partnerHistory;
  }

  const updatedCompany = await company.save();
  res.json(updatedCompany);
});
