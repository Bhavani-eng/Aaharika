const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'donation_created',
        'donation_claimed',
        'pickup_scheduled',
        'volunteer_assigned',
        'pickup_verified',
        'delivery_completed',
        'emergency_request',
        'ngo_verified',
        'review_received',
        'complaint_update',
        'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
