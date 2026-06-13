const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const validate = require('../middleware/validate');
const { complaintValidation, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.post('/', complaintValidation, validate, createComplaint);
router.get('/', getComplaints);
router.get('/:id', mongoIdParam('id'), validate, getComplaintById);
router.patch('/:id', authorize('admin'), mongoIdParam('id'), validate, updateComplaint);

module.exports = router;
