const Donation = require('../models/Donation');
const User = require('../models/User');
const Claim = require('../models/Claim');
const VolunteerTask = require('../models/VolunteerTask');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { generateQRData, generateQRCodeImage } = require('../services/qrService');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { notifyUser } = require('../services/notificationService');
const { sendDonationNotificationEmail } = require('../services/emailService');

const createDonation = asyncHandler(async (req, res) => {
  let body = { ...req.body };
  if (typeof body.pickupLocation === 'string') {
    body.pickupLocation = JSON.parse(body.pickupLocation);
  }
  body.servings = parseInt(body.servings, 10);

  const donationData = { ...body, donor: req.user._id };

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'aaharika/donations');
    donationData.image = result.secure_url;
  }

  const qrData = generateQRData('donation_pickup', 'pending', { donorId: req.user._id });
  donationData.qrCodeData = qrData;

  const donation = await Donation.create({
    ...donationData,
    timeline: [{ status: 'available', message: 'Donation created', user: req.user._id }],
  });

  const qrCode = await generateQRCodeImage(
    generateQRData('donation_pickup', donation._id.toString(), { donorId: req.user._id })
  );
  donation.qrCode = qrCode;
  donation.qrCodeData = generateQRData('donation_pickup', donation._id.toString(), {
    donorId: req.user._id,
  });
  await donation.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.donationsCreated': 1 } });

  const ngos = await User.find({ role: 'ngo', isActive: true, 'ngoVerification.status': 'approved' });
  const io = req.app.get('io');
  for (const ngo of ngos) {
    await notifyUser(io, {
      recipient: ngo._id,
      sender: req.user._id,
      type: 'donation_created',
      title: 'New Donation Available',
      message: `${donation.foodName} - ${donation.quantity} available for pickup`,
      data: { donationId: donation._id },
    });
    sendDonationNotificationEmail(ngo, donation);
  }

  res.status(201).json({ success: true, data: donation, message: 'Donation created successfully' });
});

const getDonations = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    search,
    city,
    page = 1,
    limit = 10,
    sort = '-createdAt',
    lat,
    lng,
    radius = 50,
  } = req.query;

  const filter = {};

  if (req.user.role === 'donor') {
    filter.donor = req.user._id;
  } else if (status) {
    filter.status = status;
  } else if (req.user.role === 'ngo') {
    filter.status = 'available';
  }

  if (category) filter.category = category;
  if (city) filter['pickupLocation.city'] = new RegExp(city, 'i');
  if (search) {
    filter.$or = [
      { foodName: new RegExp(search, 'i') },
      { instructions: new RegExp(search, 'i') },
    ];
  }

  let query = Donation.find(filter)
    .populate('donor', 'name organization avatar phone stats.rating')
    .populate('claimedBy', 'name organization avatar phone')
    .populate('volunteer', 'name phone avatar')
    .sort(sort);

  if (lat && lng) {
    query = Donation.find({
      ...filter,
      'pickupLocation.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000,
        },
      },
    })
      .populate('donor', 'name organization avatar phone')
      .populate('claimedBy', 'name organization avatar phone')
      .sort(sort);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [donations, total] = await Promise.all([
    query.skip(skip).limit(parseInt(limit)),
    Donation.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: donations,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id)
    .populate('donor', 'name organization avatar phone organizationType stats address')
    .populate('claimedBy', 'name organization avatar phone address')
    .populate('volunteer', 'name phone avatar');

  if (!donation) throw new ApiError(404, 'Donation not found');

  res.json({ success: true, data: donation });
});

const updateDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) throw new ApiError(404, 'Donation not found');
  if (donation.donor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }
  if (!['available', 'claimed'].includes(donation.status)) {
    throw new ApiError(400, 'Cannot update donation in current status');
  }

  const allowed = ['foodName', 'quantity', 'servings', 'instructions', 'expiryTime'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) donation[field] = req.body[field];
  });

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'aaharika/donations');
    donation.image = result.secure_url;
  }

  await donation.save();
  res.json({ success: true, data: donation, message: 'Donation updated' });
});

const cancelDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) throw new ApiError(404, 'Donation not found');
  if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  donation.status = 'cancelled';
  donation.timeline.push({
    status: 'cancelled',
    message: req.body.reason || 'Donation cancelled',
    user: req.user._id,
  });
  await donation.save();

  await Claim.updateMany({ donation: donation._id }, { status: 'cancelled' });

  res.json({ success: true, data: donation, message: 'Donation cancelled' });
});

const getDonorStats = asyncHandler(async (req, res) => {
  const donorId = req.user._id;
  const [total, active, delivered, stats] = await Promise.all([
    Donation.countDocuments({ donor: donorId }),
    Donation.countDocuments({ donor: donorId, status: { $in: ['available', 'claimed', 'scheduled'] } }),
    Donation.countDocuments({ donor: donorId, status: 'delivered' }),
    Donation.aggregate([
      { $match: { donor: donorId, status: 'delivered' } },
      {
        $group: {
          _id: null,
          totalServings: { $sum: '$servings' },
          totalDonations: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      total,
      active,
      delivered,
      mealsServed: stats[0]?.totalServings || 0,
      foodSavedKg: (stats[0]?.totalServings || 0) * 0.35,
    },
  });
});

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  cancelDonation,
  getDonorStats,
};
