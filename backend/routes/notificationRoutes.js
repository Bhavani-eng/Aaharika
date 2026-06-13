const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', mongoIdParam('id'), validate, markAsRead);
router.delete('/:id', mongoIdParam('id'), validate, deleteNotification);

module.exports = router;
