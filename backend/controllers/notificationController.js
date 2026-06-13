const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const filter = { recipient: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate('sender', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  res.json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: { page: parseInt(page), limit: parseInt(limit), total },
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!notification) throw new ApiError(404, 'Notification not found');

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.json({ success: true, data: notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  res.json({ success: true, message: 'All notifications marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.json({ success: true, message: 'Notification deleted' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
