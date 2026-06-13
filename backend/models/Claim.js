const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'scheduled', 'picked_up', 'delivered', 'cancelled'],
      default: 'pending',
    },
    pickupSchedule: {
      scheduledAt: Date,
      notes: String,
      contactPhone: String,
    },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    qrVerified: { type: Boolean, default: false },
    qrVerifiedAt: Date,
    deliveryQrVerified: { type: Boolean, default: false },
    deliveryQrVerifiedAt: Date,
    notes: String,
    cancelledAt: Date,
    cancelReason: String,
    timeline: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

claimSchema.index({ ngo: 1, status: 1 });
claimSchema.index({ donation: 1 });

module.exports = mongoose.model('Claim', claimSchema);
