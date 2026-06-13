const { body, param, query } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['donor', 'ngo', 'volunteer']).withMessage('Invalid role'),
  body('phone').optional().trim(),
  body('organization').optional().trim(),
  body('organizationType').optional().trim(),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('token').notEmpty().withMessage('Reset token is required'),
];

const updateProfileValidation = [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('organization').optional().trim(),
  body('bio').optional().isLength({ max: 500 }),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

const createDonationValidation = [
  body('foodName').trim().notEmpty().withMessage('Food name is required'),
  body('category').isIn(['prepared', 'raw', 'baked', 'packaged', 'beverages', 'fruits', 'vegetables', 'dairy', 'other']),
  body('quantity').trim().notEmpty().withMessage('Quantity is required'),
  body('servings').isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('expiryTime').isISO8601().withMessage('Valid expiry time is required'),
  body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
  body('pickupLocation.coordinates.lat').isFloat().withMessage('Valid latitude required'),
  body('pickupLocation.coordinates.lng').isFloat().withMessage('Valid longitude required'),
  body('instructions').optional().isLength({ max: 1000 }),
];

const createClaimValidation = [
  param('donationId').isMongoId().withMessage('Invalid donation ID'),
  body('notes').optional().trim(),
];

const schedulePickupValidation = [
  body('scheduledAt').isISO8601().withMessage('Valid schedule time required'),
  body('notes').optional().trim(),
  body('contactPhone').optional().trim(),
];

const createReviewValidation = [
  body('reviewee').isMongoId().withMessage('Invalid reviewee ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('feedback').optional().isLength({ max: 1000 }),
  body('type').isIn(['donor_to_ngo', 'ngo_to_donor', 'ngo_to_volunteer', 'volunteer_to_ngo']),
  body('donation').optional().isMongoId(),
  body('claim').optional().isMongoId(),
];

const emergencyRequestValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('urgencyLevel').isIn(['low', 'medium', 'high', 'critical']),
  body('quantityNeeded').trim().notEmpty(),
  body('servingsNeeded').optional().isInt({ min: 1 }),
];

const complaintValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['food_quality', 'no_show', 'late_pickup', 'misconduct', 'fraud', 'other']),
  body('against').optional().isMongoId(),
  body('donation').optional().isMongoId(),
  body('claim').optional().isMongoId(),
];

const mongoIdParam = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
  createDonationValidation,
  createClaimValidation,
  schedulePickupValidation,
  createReviewValidation,
  emergencyRequestValidation,
  complaintValidation,
  mongoIdParam,
};
