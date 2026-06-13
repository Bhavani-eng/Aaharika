const express = require('express');
const {
  createEmergencyRequest,
  getEmergencyRequests,
  getEmergencyRequestById,
  respondToEmergency,
  updateEmergencyStatus,
  cancelEmergencyRequest,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/auth');
const { authorize, requireNgoVerified } = require('../middleware/roleAuth');
const validate = require('../middleware/validate');
const { emergencyRequestValidation, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.post('/', authorize('ngo'), requireNgoVerified, emergencyRequestValidation, validate, createEmergencyRequest);
router.get('/', getEmergencyRequests);
router.get('/:id', mongoIdParam('id'), validate, getEmergencyRequestById);
router.post('/:id/respond', authorize('donor'), mongoIdParam('id'), validate, respondToEmergency);
router.patch('/:id/status', authorize('ngo', 'admin'), mongoIdParam('id'), validate, updateEmergencyStatus);
router.delete('/:id', authorize('ngo'), mongoIdParam('id'), validate, cancelEmergencyRequest);

module.exports = router;
