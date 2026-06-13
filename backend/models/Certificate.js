const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['contribution', 'service', 'volunteer'],
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    issuedAt: { type: Date, default: Date.now },
    certificateId: { type: String, unique: true, required: true },
    stats: {
      donationsCount: Number,
      mealsServed: Number,
      foodSavedKg: Number,
      deliveriesCompleted: Number,
      hoursVolunteered: Number,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
