const Claim = require('../models/Claim');
const Donation = require('../models/Donation');
const VolunteerTask = require('../models/VolunteerTask');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notifyUser } = require('../services/notificationService');
const { verifyQRData } = require('../services/qrService');

const claimDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.donationId);
  if (!donation) throw new ApiError(404, 'Donation not found');
  if (donation.status !== 'available') throw new ApiError(400, 'Donation is not available');

  const existingClaim = await Claim.findOne({
    donation: donation._id,
    status: { $nin: ['cancelled'] },
  });
  if (existingClaim) throw new ApiError(400, 'Donation already claimed');

  const claim = await Claim.create({
    donation: donation._id,
    ngo: req.user._id,
    donor: donation.donor,
    notes: req.body.notes,
    status: 'confirmed',
    timeline: [
      { status: 'confirmed', message: 'Donation claimed by NGO', user: req.user._id },
    ],
  });

  donation.status = 'claimed';
  donation.claimedBy = req.user._id;
  donation.claimedAt = new Date();
  donation.timeline.push({
    status: 'claimed',
    message: `Claimed by ${req.user.organization || req.user.name}`,
    user: req.user._id,
  });
  await donation.save();

  await VolunteerTask.create({
    claim: claim._id,
    donation: donation._id,
    status: 'available',
    pickupLocation: {
      address: donation.pickupLocation.address,
      coordinates: donation.pickupLocation.coordinates,
    },
    deliveryLocation: {
      address: req.user.address?.street || req.user.organization,
      coordinates: req.user.location?.coordinates
        ? { lat: req.user.location.coordinates[1], lng: req.user.location.coordinates[0] }
        : undefined,
    },
    timeline: [{ status: 'available', message: 'Task created for volunteers' }],
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.donationsClaimed': 1 } });

  const io = req.app.get('io');
  await notifyUser(io, {
    recipient: donation.donor,
    sender: req.user._id,
    type: 'donation_claimed',
    title: 'Donation Claimed',
    message: `${req.user.organization || req.user.name} claimed your ${donation.foodName} donation`,
    data: { donationId: donation._id, claimId: claim._id },
  });

  const populatedClaim = await Claim.findById(claim._id)
    .populate('donation')
    .populate('ngo', 'name organization avatar phone')
    .populate('donor', 'name organization avatar phone');

  res.status(201).json({ success: true, data: populatedClaim, message: 'Donation claimed successfully' });
});

const getClaims = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'ngo') filter.ngo = req.user._id;
  else if (req.user.role === 'donor') filter.donor = req.user._id;
  if (req.query.status) filter.status = req.query.status;

  const claims = await Claim.find(filter)
    .populate({
      path: 'donation',
      populate: { path: 'donor', select: 'name organization avatar phone' },
    })
    .populate('ngo', 'name organization avatar phone address')
    .populate('volunteer', 'name phone avatar')
    .sort('-createdAt');

  res.json({ success: true, data: claims });
});

const getClaimById = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('donation')
    .populate('ngo', 'name organization avatar phone address location')
    .populate('donor', 'name organization avatar phone')
    .populate('volunteer', 'name phone avatar');

  if (!claim) throw new ApiError(404, 'Claim not found');
  res.json({ success: true, data: claim });
});

const schedulePickup = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) throw new ApiError(404, 'Claim not found');

  const isAuthorized =
    claim.ngo.toString() === req.user._id.toString() ||
    claim.donor.toString() === req.user._id.toString();
  if (!isAuthorized) throw new ApiError(403, 'Not authorized');

  claim.pickupSchedule = {
    scheduledAt: req.body.scheduledAt,
    notes: req.body.notes,
    contactPhone: req.body.contactPhone,
  };
  claim.status = 'scheduled';
  claim.timeline.push({
    status: 'scheduled',
    message: `Pickup scheduled for ${new Date(req.body.scheduledAt).toLocaleString()}`,
    user: req.user._id,
  });
  await claim.save();

  const donation = await Donation.findByIdAndUpdate(claim.donation, {
    status: 'scheduled',
    pickupScheduledAt: req.body.scheduledAt,
    $push: {
      timeline: {
        status: 'scheduled',
        message: 'Pickup scheduled',
        user: req.user._id,
      },
    },
  });

  const io = req.app.get('io');
  const notifyTarget = claim.ngo.toString() === req.user._id.toString() ? claim.donor : claim.ngo;
  await notifyUser(io, {
    recipient: notifyTarget,
    sender: req.user._id,
    type: 'pickup_scheduled',
    title: 'Pickup Scheduled',
    message: `Pickup scheduled for ${new Date(req.body.scheduledAt).toLocaleString()}`,
    data: { claimId: claim._id, donationId: donation._id },
  });

  res.json({ success: true, data: claim, message: 'Pickup scheduled' });
});

const verifyPickupQR = asyncHandler(async (req, res) => {
  const { qrData } = req.body;
  const claim = await Claim.findById(req.params.id).populate('donation');
  if (!claim) throw new ApiError(404, 'Claim not found');

  const verification = verifyQRData(qrData, claim.donation._id.toString(), 'donation_pickup');
  if (!verification.valid) throw new ApiError(400, verification.message);

  claim.qrVerified = true;
  claim.qrVerifiedAt = new Date();
  claim.status = 'picked_up';
  claim.timeline.push({
    status: 'picked_up',
    message: 'Pickup verified via QR code',
    user: req.user._id,
  });
  await claim.save();

  await Donation.findByIdAndUpdate(claim.donation._id, {
    status: 'picked_up',
    pickedUpAt: new Date(),
    $push: { timeline: { status: 'picked_up', message: 'Food picked up', user: req.user._id } },
  });

  const task = await VolunteerTask.findOne({ claim: claim._id });
  if (task) {
    task.status = 'pickup_verified';
    task.pickupVerifiedAt = new Date();
    task.timeline.push({ status: 'pickup_verified', message: 'Pickup QR verified', user: req.user._id });
    await task.save();
  }

  res.json({ success: true, data: claim, message: 'Pickup verified successfully' });
});

const cancelClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) throw new ApiError(404, 'Claim not found');
  if (claim.ngo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  claim.status = 'cancelled';
  claim.cancelledAt = new Date();
  claim.cancelReason = req.body.reason;
  await claim.save();

  await Donation.findByIdAndUpdate(claim.donation, {
    status: 'available',
    claimedBy: null,
    claimedAt: null,
  });

  await VolunteerTask.updateMany({ claim: claim._id }, { status: 'cancelled' });

  res.json({ success: true, data: claim, message: 'Claim cancelled' });
});

module.exports = {
  claimDonation,
  getClaims,
  getClaimById,
  schedulePickup,
  verifyPickupQR,
  cancelClaim,
};
