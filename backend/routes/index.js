const express = require('express');
const authRoutes = require('./authRoutes');
const donationRoutes = require('./donationRoutes');
const claimRoutes = require('./claimRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const notificationRoutes = require('./notificationRoutes');
const reviewRoutes = require('./reviewRoutes');
const certificateRoutes = require('./certificateRoutes');
const emergencyRoutes = require('./emergencyRoutes');
const complaintRoutes = require('./complaintRoutes');
const adminRoutes = require('./adminRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/donations', donationRoutes);
router.use('/claims', claimRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/certificates', certificateRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/complaints', complaintRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
