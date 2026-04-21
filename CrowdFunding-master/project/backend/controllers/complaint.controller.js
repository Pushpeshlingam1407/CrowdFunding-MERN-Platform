import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  try {
    const { type, subject, description, screenshot, targetCompanyId } = req.body;
    const authorId = req.user.id;

    const complaint = await Complaint.create({
      author: authorId,
      type,
      subject,
      description,
      screenshot,
      targetCompany: targetCompanyId
    });

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await Complaint.find({ author: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin only: Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('author', 'name email')
      .populate('targetCompany', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
