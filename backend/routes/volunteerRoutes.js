const express = require('express');
const {
  getTasks,
  acceptTask,
  updateTaskStatus,
  verifyDeliveryQR,
  getVolunteerStats,
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.get('/stats', authorize('volunteer'), getVolunteerStats);
router.post('/:id/accept', authorize('volunteer'), mongoIdParam('id'), validate, acceptTask);
router.patch('/:id/status', authorize('volunteer'), mongoIdParam('id'), validate, updateTaskStatus);
router.post('/:id/verify-delivery', authorize('ngo', 'volunteer'), mongoIdParam('id'), validate, verifyDeliveryQR);

module.exports = router;
