const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notifyUser, createBulkNotifications } = require('../services/notificationService');

const createEmergencyRequest = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.create({
    ...req.body,
    ngo: req.user._id,
    location: req.body.location || {
      address: req.user.address?.street,
      coordinates: req.user.location?.coordinates
        ? { lat: req.user.location.coordinates[1], lng: req.user.location.coordinates[0] }
        : undefined,
    },
    expiresAt: req.body.expiresAt || new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  const donors = await User.find({ role: 'donor', isActive: true });
  const io = req.app.get('io');
  const notifications = donors.map((donor) => ({
    recipient: donor._id,
    sender: req.user._id,
    type: 'emergency_request',
    title: `Emergency: ${request.title}`,
    message: `${request.urgencyLevel.toUpperCase()} urgency - ${request.quantityNeeded} needed`,
    data: { emergencyRequestId: request._id },
  }));
  await createBulkNotifications(notifications);
  notifications.forEach((n) => emitToUser(io, n.recipient, n));

  res.status(201).json({ success: true, data: request, message: 'Emergency request created' });
});

const emitToUser = (io, userId, notification) => {
  if (io) io.to(`user:${userId}`).emit('notification', notification);
};

const getEmergencyRequests = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'ngo') filter.ngo = req.user._id;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.urgency) filter.urgencyLevel = req.query.urgency;
  if (req.user.role === 'donor') filter.status = 'open';

  const requests = await EmergencyRequest.find(filter)
    .populate('ngo', 'name organization avatar phone address')
    .sort({ urgencyLevel: -1, createdAt: -1 });

  res.json({ success: true, data: requests });
});

const getEmergencyRequestById = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.findById(req.params.id).populate(
    'ngo',
    'name organization avatar phone address'
  );
  if (!request) throw new ApiError(404, 'Emergency request not found');
  res.json({ success: true, data: request });
});

const respondToEmergency = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Emergency request not found');
  if (request.status === 'fulfilled' || request.status === 'cancelled') {
    throw new ApiError(400, 'Request is no longer active');
  }

  request.responses.push({
    donor: req.user._id,
    donation: req.body.donation,
    message: req.body.message,
  });

  if (req.body.donation) {
    request.fulfilledBy.push(req.body.donation);
    request.status = 'partially_fulfilled';
  }

  await request.save();

  const io = req.app.get('io');
  await notifyUser(io, {
    recipient: request.ngo,
    sender: req.user._id,
    type: 'emergency_request',
    title: 'Emergency Response',
    message: `${req.user.name} responded to your emergency request`,
    data: { emergencyRequestId: request._id },
  });

  res.json({ success: true, data: request, message: 'Response submitted' });
});

const updateEmergencyStatus = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Emergency request not found');
  if (request.ngo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  request.status = req.body.status;
  await request.save();
  res.json({ success: true, data: request });
});

const cancelEmergencyRequest = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Emergency request not found');
  if (request.ngo.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  request.status = 'cancelled';
  await request.save();
  res.json({ success: true, data: request, message: 'Emergency request cancelled' });
});

module.exports = {
  createEmergencyRequest,
  getEmergencyRequests,
  getEmergencyRequestById,
  respondToEmergency,
  updateEmergencyStatus,
  cancelEmergencyRequest,
};
