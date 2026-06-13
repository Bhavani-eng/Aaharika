const mongoose = require('mongoose');

const volunteerTaskSchema = new mongoose.Schema(
  {
    claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['available', 'accepted', 'pickup_verified', 'in_transit', 'delivered', 'cancelled'],
      default: 'available',
    },
    pickupLocation: {
      address: String,
      coordinates: { lat: Number, lng: Number },
    },
    deliveryLocation: {
      address: String,
      coordinates: { lat: Number, lng: Number },
    },
    scheduledAt: Date,
    acceptedAt: Date,
    pickupVerifiedAt: Date,
    deliveredAt: Date,
    deliveryQrCode: String,
    notes: String,
    distance: Number,
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

volunteerTaskSchema.index({ volunteer: 1, status: 1 });
volunteerTaskSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('VolunteerTask', volunteerTaskSchema);
