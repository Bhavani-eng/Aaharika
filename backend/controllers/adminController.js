const User = require('../models/User');
const Donation = require('../models/Donation');
const Claim = require('../models/Claim');
const Complaint = require('../models/Complaint');
const EmergencyRequest = require('../models/EmergencyRequest');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notifyUser } = require('../services/notificationService');

const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalDonors,
    totalNgos,
    totalVolunteers,
    totalDonations,
    activeDonations,
    deliveredDonations,
    pendingNgoVerifications,
    openComplaints,
    openEmergencies,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'donor' }),
    User.countDocuments({ role: 'ngo' }),
    User.countDocuments({ role: 'volunteer' }),
    Donation.countDocuments(),
    Donation.countDocuments({ status: { $in: ['available', 'claimed', 'scheduled'] } }),
    Donation.countDocuments({ status: 'delivered' }),
    User.countDocuments({ role: 'ngo', 'ngoVerification.status': 'pending' }),
    Complaint.countDocuments({ status: { $in: ['open', 'investigating'] } }),
    EmergencyRequest.countDocuments({ status: 'open' }),
  ]);

  res.json({
    success: true,
    data: {
      users: { total: totalUsers, donors: totalDonors, ngos: totalNgos, volunteers: totalVolunteers },
      donations: { total: totalDonations, active: activeDonations, delivered: deliveredDonations },
      pendingNgoVerifications,
      openComplaints,
      openEmergencies,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { organization: new RegExp(search, 'i') },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { page: parseInt(page), limit: parseInt(limit), total },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  const { isActive, role, isVerified } = req.body;
  if (isActive !== undefined) user.isActive = isActive;
  if (role) user.role = role;
  if (isVerified !== undefined) user.isVerified = isVerified;

  await user.save();
  res.json({ success: true, data: user, message: 'User updated' });
});

const verifyNgo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'ngo') throw new ApiError(404, 'NGO not found');

  const { status, rejectionReason } = req.body;
  user.ngoVerification.status = status;
  user.ngoVerification.verifiedAt = new Date();
  user.ngoVerification.verifiedBy = req.user._id;
  if (rejectionReason) user.ngoVerification.rejectionReason = rejectionReason;
  if (status === 'approved') user.isVerified = true;

  await user.save();

  const io = req.app.get('io');
  await notifyUser(io, {
    recipient: user._id,
    sender: req.user._id,
    type: 'ngo_verified',
    title: `NGO Verification ${status}`,
    message: status === 'approved' ? 'Your NGO has been verified!' : `Verification rejected: ${rejectionReason}`,
    data: { status },
  });

  res.json({ success: true, data: user, message: `NGO ${status}` });
});

const getPendingNgos = asyncHandler(async (req, res) => {
  const ngos = await User.find({ role: 'ngo', 'ngoVerification.status': 'pending' }).sort('-createdAt');
  res.json({ success: true, data: ngos });
});

const getAllDonations = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [donations, total] = await Promise.all([
    Donation.find(filter)
      .populate('donor', 'name organization')
      .populate('claimedBy', 'name organization')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Donation.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: donations,
    pagination: { page: parseInt(page), limit: parseInt(limit), total },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot delete admin user');

  user.isActive = false;
  await user.save();
  res.json({ success: true, message: 'User deactivated' });
});

const createAdmin = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new ApiError(400, 'Email already exists');

  const admin = await User.create({
    name: req.body.name || 'Admin',
    email: req.body.email,
    password: req.body.password,
    role: 'admin',
    isVerified: true,
    isActive: true,
  });

  res.status(201).json({ success: true, data: admin, message: 'Admin created' });
});

module.exports = {
  getDashboard,
  getUsers,
  updateUser,
  verifyNgo,
  getPendingNgos,
  getAllDonations,
  deleteUser,
  createAdmin,
};
