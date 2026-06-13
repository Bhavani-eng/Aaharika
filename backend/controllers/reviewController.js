const Review = require('../models/Review');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notifyUser } = require('../services/notificationService');

const createReview = asyncHandler(async (req, res) => {
  const { reviewee, rating, feedback, type, donation, claim } = req.body;

  const revieweeUser = await User.findById(reviewee);
  if (!revieweeUser) throw new ApiError(404, 'User not found');

  const review = await Review.create({
    reviewer: req.user._id,
    reviewee,
    rating,
    feedback,
    type,
    donation,
    claim,
  });

  const reviews = await Review.find({ reviewee });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await User.findByIdAndUpdate(reviewee, {
    'stats.rating': Math.round(avgRating * 10) / 10,
    'stats.reviewCount': reviews.length,
  });

  const io = req.app.get('io');
  await notifyUser(io, {
    recipient: reviewee,
    sender: req.user._id,
    type: 'review_received',
    title: 'New Review Received',
    message: `You received a ${rating}-star review`,
    data: { reviewId: review._id },
  });

  const populated = await Review.findById(review._id)
    .populate('reviewer', 'name avatar')
    .populate('reviewee', 'name avatar');

  res.status(201).json({ success: true, data: populated, message: 'Review submitted' });
});

const getReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.userId) filter.reviewee = req.query.userId;
  if (req.query.reviewer) filter.reviewer = req.query.reviewer;
  if (req.user.role !== 'admin' && !req.query.userId) {
    filter.$or = [{ reviewer: req.user._id }, { reviewee: req.user._id }];
  }

  const reviews = await Review.find(filter)
    .populate('reviewer', 'name avatar organization')
    .populate('reviewee', 'name avatar organization')
    .populate('donation', 'foodName')
    .sort('-createdAt');

  res.json({ success: true, data: reviews });
});

const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('reviewer', 'name avatar')
    .populate('reviewee', 'name avatar');
  if (!review) throw new ApiError(404, 'Review not found');
  res.json({ success: true, data: review });
});

module.exports = { createReview, getReviews, getReviewById };
