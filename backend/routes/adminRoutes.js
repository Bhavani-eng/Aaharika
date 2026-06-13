const express = require('express');
const {
  getDashboard,
  getUsers,
  updateUser,
  verifyNgo,
  getPendingNgos,
  getAllDonations,
  deleteUser,
  createAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id', mongoIdParam('id'), validate, updateUser);
router.delete('/users/:id', mongoIdParam('id'), validate, deleteUser);
router.get('/ngos/pending', getPendingNgos);
router.patch('/ngos/:id/verify', mongoIdParam('id'), validate, verifyNgo);
router.get('/donations', getAllDonations);
router.post('/create-admin', createAdmin);

module.exports = router;
