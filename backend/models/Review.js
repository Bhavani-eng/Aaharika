const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
    claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, maxlength: 1000 },
    type: {
      type: String,
      enum: ['donor_to_ngo', 'ngo_to_donor', 'ngo_to_volunteer', 'volunteer_to_ngo'],
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ reviewer: 1, donation: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
