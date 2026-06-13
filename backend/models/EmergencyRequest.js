const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema(
  {
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    quantityNeeded: { type: String, required: true },
    servingsNeeded: { type: Number, min: 1 },
    foodCategories: [String],
    location: {
      address: String,
      coordinates: { lat: Number, lng: Number },
    },
    status: {
      type: String,
      enum: ['open', 'partially_fulfilled', 'fulfilled', 'cancelled', 'expired'],
      default: 'open',
    },
    fulfilledBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
    expiresAt: Date,
    responses: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
        message: String,
        respondedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

emergencyRequestSchema.index({ status: 1, urgencyLevel: 1 });
emergencyRequestSchema.index({ ngo: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
