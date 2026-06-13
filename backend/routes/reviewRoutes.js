const express = require('express');
const { createReview, getReviews, getReviewById } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createReviewValidation, mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.post('/', createReviewValidation, validate, createReview);
router.get('/', getReviews);
router.get('/:id', mongoIdParam('id'), validate, getReviewById);

module.exports = router;
