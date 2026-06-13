const VolunteerTask = require('../models/VolunteerTask');
const Claim = require('../models/Claim');
const Donation = require('../models/Donation');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notifyUser } = require('../services/notificationService');
const { generateQRData, generateQRCodeImage, verifyQRData } = require('../services/qrService');

const getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.user.role === 'volunteer') {
    if (req.query.mine === 'true') {
      filter.volunteer = req.user._id;
    } else {
      filter.status = 'available';
    }
  }

  const tasks = await VolunteerTask.find(filter)
    .populate({
      path: 'donation',
      populate: { path: 'donor', select: 'name organization phone avatar' },
    })
    .populate({
      path: 'claim',
      populate: { path: 'ngo', select: 'name organization phone address avatar' },
    })
    .populate('volunteer', 'name phone avatar')
    .sort('-createdAt');

  res.json({ success: true, data: tasks });
});

const acceptTask = asyncHandler(async (req, res) => {
  const task = await VolunteerTask.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  if (task.status !== 'available') throw new ApiError(400, 'Task is not available');

  task.volunteer = req.user._id;
  task.status = 'accepted';
  task.acceptedAt = new Date();
  task.timeline.push({
    status: 'accepted',
    message: `Accepted by ${req.user.name}`,
    user: req.user._id,
  });

  const deliveryQrData = generateQRData('delivery', task._id.toString(), {
    claimId: task.claim.toString(),
  });
  task.deliveryQrCode = await generateQRCodeImage(deliveryQrData);
  await task.save();

  await Claim.findByIdAndUpdate(task.claim, {
    volunteer: req.user._id,
    $push: { timeline: { status: 'volunteer_assigned', message: `Volunteer ${req.user.name} assigned`, user: req.user._id } },
  });

  await Donation.findByIdAndUpdate(task.donation, { volunteer: req.user._id });

  const claim = await Claim.findById(task.claim);
  const io = req.app.get('io');
  await notifyUser(io, {
    recipient: claim.ngo,
    sender: req.user._id,
    type: 'volunteer_assigned',
    title: 'Volunteer Assigned',
    message: `${req.user.name} will handle the delivery`,
    data: { taskId: task._id },
  });

  res.json({ success: true, data: task, message: 'Task accepted' });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await VolunteerTask.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  if (task.volunteer?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  const validTransitions = {
    accepted: ['in_transit'],
    pickup_verified: ['in_transit'],
    in_transit: ['delivered'],
  };

  if (!validTransitions[task.status]?.includes(status)) {
    throw new ApiError(400, `Cannot transition from ${task.status} to ${status}`);
  }

  task.status = status;
  task.timeline.push({ status, message: `Status updated to ${status}`, user: req.user._id });

  if (status === 'in_transit') {
    task.timeline.push({ status: 'in_transit', message: 'Volunteer en route for delivery', user: req.user._id });
  }

  if (status === 'delivered') {
    task.deliveredAt = new Date();
    await Claim.findByIdAndUpdate(task.claim, {
      status: 'delivered',
      deliveryQrVerified: true,
      deliveryQrVerifiedAt: new Date(),
    });
    const donation = await Donation.findByIdAndUpdate(task.donation, {
      status: 'delivered',
      deliveredAt: new Date(),
      $push: { timeline: { status: 'delivered', message: 'Food delivered successfully', user: req.user._id } },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.deliveriesCompleted': 1, 'stats.mealsServed': donation?.servings || 0 },
    });
    await User.findByIdAndUpdate(donation.donor, {
      $inc: { 'stats.mealsServed': donation?.servings || 0, 'stats.foodSavedKg': (donation?.servings || 0) * 0.35 },
    });

    const claim = await Claim.findById(task.claim);
    const io = req.app.get('io');
    await notifyUser(io, {
      recipient: claim.ngo,
      sender: req.user._id,
      type: 'delivery_completed',
      title: 'Delivery Completed',
      message: 'Food has been delivered successfully',
      data: { taskId: task._id },
    });
    await notifyUser(io, {
      recipient: claim.donor,
      sender: req.user._id,
      type: 'delivery_completed',
      title: 'Delivery Completed',
      message: 'Your donation has been delivered',
      data: { taskId: task._id },
    });
  }

  await task.save();
  res.json({ success: true, data: task, message: 'Task status updated' });
});

const verifyDeliveryQR = asyncHandler(async (req, res) => {
  const { qrData } = req.body;
  const task = await VolunteerTask.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  const verification = verifyQRData(qrData, task._id.toString(), 'delivery');
  if (!verification.valid) throw new ApiError(400, verification.message);

  task.status = 'delivered';
  task.deliveredAt = new Date();
  task.timeline.push({ status: 'delivered', message: 'Delivery verified via QR', user: req.user._id });
  await task.save();

  res.json({ success: true, data: task, message: 'Delivery verified' });
});

const getVolunteerStats = asyncHandler(async (req, res) => {
  const volunteerId = req.user._id;
  const [total, completed, active] = await Promise.all([
    VolunteerTask.countDocuments({ volunteer: volunteerId }),
    VolunteerTask.countDocuments({ volunteer: volunteerId, status: 'delivered' }),
    VolunteerTask.countDocuments({ volunteer: volunteerId, status: { $in: ['accepted', 'in_transit', 'pickup_verified'] } }),
  ]);

  res.json({
    success: true,
    data: { total, completed, active, ...req.user.stats },
  });
});

module.exports = {
  getTasks,
  acceptTask,
  updateTaskStatus,
  verifyDeliveryQR,
  getVolunteerStats,
};
