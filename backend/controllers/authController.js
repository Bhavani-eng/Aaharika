const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
const { uploadToCloudinary } = require('../services/cloudinaryService');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, organization, organizationType, address, location } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    organization,
    organizationType,
    address,
    location,
    ngoVerification: role === 'ngo' ? { status: 'pending' } : undefined,
  });

  const token = generateToken(user._id);
  sendWelcomeEmail(user);

  res.status(201).json({
    success: true,
    data: { user, token },
    message: 'Registration successful',
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account has been deactivated');
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    data: { user, token },
    message: 'Login successful',
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'organization', 'organizationType', 'address', 'location', 'bio'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = typeof req.body[field] === 'string' && ['address', 'location'].includes(field)
        ? JSON.parse(req.body[field])
        : req.body[field];
    }
  });

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'aaharika/avatars');
    updates.avatar = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: user, message: 'Profile updated' });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json({ success: true, message: 'If email exists, reset link has been sent' });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user, resetUrl);

  res.json({ success: true, message: 'If email exists, reset link has been sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.json({ success: true, data: { user, token }, message: 'Password reset successful' });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserById,
};
