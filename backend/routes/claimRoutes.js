const express = require('express');
const {
  claimDonation,
  getClaims,
  getClaimById,
  schedulePickup,
  verifyPickupQR,
  cancelClaim,
} = require('../controllers/claimController');
const { protect } = require('../middleware/auth');
const { authorize, requireNgoVerified } = require('../middleware/roleAuth');
const validate = require('../middleware/validate');
const { createClaimValidation, schedulePickupValidation, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.post('/:donationId', authorize('ngo'), requireNgoVerified, createClaimValidation, validate, claimDonation);
router.get('/', getClaims);
router.get('/:id', mongoIdParam('id'), validate, getClaimById);
router.put('/:id/schedule', schedulePickupValidation, validate, mongoIdParam('id'), validate, schedulePickup);
router.post('/:id/verify-pickup', authorize('volunteer', 'ngo', 'donor'), mongoIdParam('id'), validate, verifyPickupQR);
router.patch('/:id/cancel', authorize('ngo', 'admin'), mongoIdParam('id'), validate, cancelClaim);

module.exports = router;
