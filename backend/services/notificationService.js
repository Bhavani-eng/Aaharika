const Notification = require('../models/Notification');

const createNotification = async ({ recipient, sender, type, title, message, data }) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    data,
  });
  return notification;
};

const createBulkNotifications = async (notifications) => {
  return Notification.insertMany(notifications);
};

const emitNotification = (io, userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

const notifyUser = async (io, { recipient, sender, type, title, message, data }) => {
  const notification = await createNotification({
    recipient,
    sender,
    type,
    title,
    message,
    data,
  });
  emitNotification(io, recipient.toString(), notification);
  return notification;
};

module.exports = {
  createNotification,
  createBulkNotifications,
  emitNotification,
  notifyUser,
};
