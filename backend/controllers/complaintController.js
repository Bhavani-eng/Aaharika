const Complaint = require('../models/Complaint');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { notifyUser } = require('../services/notificationService');

const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({
    ...req.body,
    filedBy: req.user._id,
  });

  res.status(201).json({ success: true, data: complaint, message: 'Complaint filed successfully' });
});

const getComplaints = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.filedBy = req.user._id;
  }
  if (req.query.status) filter.status = req.query.status;

  const complaints = await Complaint.find(filter)
    .populate('filedBy', 'name email avatar role')
    .populate('against', 'name email avatar role organization')
    .populate('donation', 'foodName')
    .sort('-createdAt');

  res.json({ success: true, data: complaints });
});

const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('filedBy', 'name email avatar role')
    .populate('against', 'name email avatar role organization')
    .populate('donation', 'foodName')
    .populate('resolvedBy', 'name');

  if (!complaint) throw new ApiError(404, 'Complaint not found');
  res.json({ success: true, data: complaint });
});

const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  const { status, adminNotes, resolution, priority } = req.body;
  if (status) complaint.status = status;
  if (adminNotes) complaint.adminNotes = adminNotes;
  if (resolution) complaint.resolution = resolution;
  if (priority) complaint.priority = priority;

  if (status === 'resolved' || status === 'dismissed') {
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();
  }

  await complaint.save();

  const io = req.app.get('io');
  await notifyUser(io, {
    recipient: complaint.filedBy,
    sender: req.user._id,
    type: 'complaint_update',
    title: 'Complaint Update',
    message: `Your complaint status: ${complaint.status}`,
    data: { complaintId: complaint._id },
  });

  res.json({ success: true, data: complaint, message: 'Complaint updated' });
});

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint };
