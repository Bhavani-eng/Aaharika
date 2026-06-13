const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Donation = require('../models/Donation');
const VolunteerTask = require('../models/VolunteerTask');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');

const generateCertificateId = () => {
  return `AAH-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

const generateCertificate = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const user = req.user;

  let title, description, stats;

  if (type === 'contribution' && user.role === 'donor') {
    const delivered = await Donation.countDocuments({ donor: user._id, status: 'delivered' });
    const servings = await Donation.aggregate([
      { $match: { donor: user._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$servings' } } },
    ]);
    title = 'Certificate of Contribution';
    description = `Awarded to ${user.name} for outstanding food donation contributions`;
    stats = {
      donationsCount: delivered,
      mealsServed: servings[0]?.total || 0,
      foodSavedKg: (servings[0]?.total || 0) * 0.35,
    };
  } else if (type === 'service' && user.role === 'ngo') {
    title = 'Certificate of Service';
    description = `Awarded to ${user.organization || user.name} for dedicated community service`;
    stats = {
      donationsCount: user.stats.donationsClaimed,
      mealsServed: user.stats.mealsServed,
      foodSavedKg: user.stats.foodSavedKg,
    };
  } else if (type === 'volunteer' && user.role === 'volunteer') {
    const completed = await VolunteerTask.countDocuments({ volunteer: user._id, status: 'delivered' });
    title = 'Certificate of Volunteer Service';
    description = `Awarded to ${user.name} for exceptional volunteer delivery service`;
    stats = {
      deliveriesCompleted: completed,
      mealsServed: user.stats.mealsServed,
      hoursVolunteered: completed * 2,
    };
  } else {
    throw new ApiError(400, 'Invalid certificate type for your role');
  }

  const certificate = await Certificate.create({
    user: user._id,
    type,
    title,
    description,
    certificateId: generateCertificateId(),
    stats,
    metadata: { userName: user.name, organization: user.organization, role: user.role },
  });

  res.status(201).json({ success: true, data: certificate, message: 'Certificate generated' });
});

const getCertificates = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.user.role === 'admin' && req.query.userId) {
    filter.user = req.query.userId;
  }

  const certificates = await Certificate.find(filter)
    .populate('user', 'name organization avatar role')
    .sort('-issuedAt');

  res.json({ success: true, data: certificates });
});

const getCertificateById = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id).populate('user', 'name organization avatar role');
  if (!certificate) throw new ApiError(404, 'Certificate not found');

  if (
    certificate.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Not authorized');
  }

  res.json({ success: true, data: certificate });
});

module.exports = { generateCertificate, getCertificates, getCertificateById };
