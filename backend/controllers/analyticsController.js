const Donation = require('../models/Donation');
const User = require('../models/User');
const VolunteerTask = require('../models/VolunteerTask');
const Claim = require('../models/Claim');
const asyncHandler = require('../utils/asyncHandler');

const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const [
    deliveredDonations,
    monthlyTrends,
    topDonors,
    deliveryStats,
    categoryBreakdown,
    platformStats,
  ] = await Promise.all([
    getDeliveredStats(userId, role),
    getMonthlyTrends(userId, role),
    getTopDonors(),
    getDeliverySuccessRate(userId, role),
    getCategoryBreakdown(userId, role),
    getPlatformStats(),
  ]);

  res.json({
    success: true,
    data: {
      ...deliveredDonations,
      monthlyTrends,
      topDonors,
      deliveryStats,
      categoryBreakdown,
      platformStats,
    },
  });
});

const getDeliveredStats = async (userId, role) => {
  const match = { status: 'delivered' };
  if (role === 'donor') match.donor = userId;
  else if (role === 'ngo') match.claimedBy = userId;

  const result = await Donation.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        totalServings: { $sum: '$servings' },
      },
    },
  ]);

  const servings = result[0]?.totalServings || 0;
  return {
    foodSavedKg: Math.round(servings * 0.35 * 10) / 10,
    mealsServed: servings,
    totalDelivered: result[0]?.totalDonations || 0,
  };
};

const getMonthlyTrends = async (userId, role) => {
  const match = { status: 'delivered' };
  if (role === 'donor') match.donor = userId;
  else if (role === 'ngo') match.claimedBy = userId;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  match.deliveredAt = { $gte: sixMonthsAgo };

  return Donation.aggregate([
    { $match: match },
    {
      $group: {
        _id: { year: { $year: '$deliveredAt' }, month: { $month: '$deliveredAt' } },
        donations: { $sum: 1 },
        servings: { $sum: '$servings' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            { $toString: { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] } },
          ],
        },
        donations: 1,
        servings: 1,
        foodSavedKg: { $multiply: ['$servings', 0.35] },
      },
    },
  ]);
};

const getTopDonors = async () => {
  return Donation.aggregate([
    { $match: { status: 'delivered' } },
    {
      $group: {
        _id: '$donor',
        totalDonations: { $sum: 1 },
        totalServings: { $sum: '$servings' },
      },
    },
    { $sort: { totalServings: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'donor',
      },
    },
    { $unwind: '$donor' },
    {
      $project: {
        _id: 0,
        donorId: '$_id',
        name: '$donor.name',
        organization: '$donor.organization',
        avatar: '$donor.avatar',
        totalDonations: 1,
        totalServings: 1,
      },
    },
  ]);
};

const getDeliverySuccessRate = async (userId, role) => {
  let totalClaims, deliveredClaims;

  if (role === 'volunteer') {
    const tasks = await VolunteerTask.aggregate([
      { $match: { volunteer: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = tasks.reduce((s, t) => s + t.count, 0);
    const delivered = tasks.find((t) => t._id === 'delivered')?.count || 0;
    return { total, delivered, successRate: total ? Math.round((delivered / total) * 100) : 0 };
  }

  const filter = role === 'donor' ? { donor: userId } : role === 'ngo' ? { ngo: userId } : {};
  totalClaims = await Claim.countDocuments(filter);
  deliveredClaims = await Claim.countDocuments({ ...filter, status: 'delivered' });

  return {
    total: totalClaims,
    delivered: deliveredClaims,
    successRate: totalClaims ? Math.round((deliveredClaims / totalClaims) * 100) : 0,
  };
};

const getCategoryBreakdown = async (userId, role) => {
  const match = {};
  if (role === 'donor') match.donor = userId;

  return Donation.aggregate([
    { $match: match },
    { $group: { _id: '$category', count: { $sum: 1 }, servings: { $sum: '$servings' } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, category: '$_id', count: 1, servings: 1 } },
  ]);
};

const getPlatformStats = async () => {
  const [users, donations, delivered, emergencies] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Donation.countDocuments(),
    Donation.countDocuments({ status: 'delivered' }),
    Donation.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, servings: { $sum: '$servings' } } },
    ]),
  ]);

  return {
    activeUsers: users,
    totalDonations: donations,
    deliveredDonations: delivered,
    totalMealsServed: delivered[0]?.servings || 0,
    foodSavedKg: Math.round((delivered[0]?.servings || 0) * 0.35 * 10) / 10,
  };
};

const getPublicStats = asyncHandler(async (req, res) => {
  const stats = await getPlatformStats();
  const [donors, ngos, volunteers] = await Promise.all([
    User.countDocuments({ role: 'donor', isActive: true }),
    User.countDocuments({ role: 'ngo', isActive: true, 'ngoVerification.status': 'approved' }),
    User.countDocuments({ role: 'volunteer', isActive: true }),
  ]);

  res.json({
    success: true,
    data: { ...stats, donors, ngos, volunteers },
  });
});

module.exports = { getAnalytics, getPublicStats };
