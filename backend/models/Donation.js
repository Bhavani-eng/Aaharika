const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['prepared', 'raw', 'baked', 'packaged', 'beverages', 'fruits', 'vegetables', 'dairy', 'other'],
      required: true,
    },
    quantity: { type: String, required: true },
    servings: { type: Number, required: true, min: 1 },
    expiryTime: { type: Date, required: true },
    pickupLocation: {
      address: { type: String, required: true },
      city: String,
      state: String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    image: { type: String, default: '' },
    instructions: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ['available', 'claimed', 'scheduled', 'picked_up', 'delivered', 'expired', 'cancelled'],
      default: 'available',
    },
    qrCode: { type: String, default: '' },
    qrCodeData: { type: String, default: '' },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimedAt: Date,
    pickupScheduledAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeline: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    isEmergency: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

donationSchema.index({ status: 1, expiryTime: 1 });
donationSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
donationSchema.index({ donor: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
