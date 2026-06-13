const express = require('express');
const {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  cancelDonation,
  getDonorStats,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const parseFormDataFields = require('../middleware/parseFormData');
const validate = require('../middleware/validate');
const { createDonationValidation, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.post('/', authorize('donor', 'admin'), upload.single('image'), parseFormDataFields(['pickupLocation']), createDonationValidation, validate, createDonation);
router.get('/', getDonations);
router.get('/stats', authorize('donor'), getDonorStats);
router.get('/:id', mongoIdParam('id'), validate, getDonationById);
router.put('/:id', authorize('donor', 'admin'), upload.single('image'), mongoIdParam('id'), validate, updateDonation);
router.patch('/:id/cancel', authorize('donor', 'admin'), mongoIdParam('id'), validate, cancelDonation);

module.exports = router;
