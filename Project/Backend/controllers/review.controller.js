import Review from '../models/Review.js';
import User from '../models/User.js';

export const createReview = async (req, res) => {
  try {
    const { companyId, rating, comment, appreciation, feedback } = req.body;
    const authorId = req.user.id;

    const review = await Review.create({
      author: authorId,
      company: companyId,
      rating,
      comment,
      appreciation,
      feedback
    });

    // Update company stats (User model)
    const company = await User.findById(companyId);
    if (company) {
      const allReviews = await Review.find({ company: companyId });
      const avgStars = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
      company.stars = avgStars;
      company.reviewsCount = allReviews.length;
      await company.save();
    }

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCompanyReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const reviews = await Review.find({ company: companyId })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
