const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    filedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
    claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['food_quality', 'no_show', 'late_pickup', 'misconduct', 'fraud', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'dismissed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    adminNotes: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
    resolution: String,
  },
  { timestamps: true }
);

complaintSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
