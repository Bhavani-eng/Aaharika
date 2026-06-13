const express = require('express');
const {
  generateCertificate,
  getCertificates,
  getCertificateById,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect);

router.post('/generate', generateCertificate);
router.get('/', getCertificates);
router.get('/:id', mongoIdParam('id'), validate, getCertificateById);

module.exports = router;
