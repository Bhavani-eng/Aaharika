const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer', 'admin'],
      required: true,
    },
    phone: { type: String, trim: true },
    avatar: { type: String, default: '' },
    organization: { type: String, trim: true },
    organizationType: {
      type: String,
      enum: ['restaurant', 'hotel', 'bakery', 'supermarket', 'event', 'ngo', 'orphanage', 'shelter', 'community_kitchen', 'other', ''],
      default: '',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    bio: { type: String, maxlength: 500 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ngoVerification: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      documents: [String],
      verifiedAt: Date,
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rejectionReason: String,
    },
    stats: {
      donationsCreated: { type: Number, default: 0 },
      donationsClaimed: { type: Number, default: 0 },
      deliveriesCompleted: { type: Number, default: 0 },
      mealsServed: { type: Number, default: 0 },
      foodSavedKg: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1, isActive: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
