const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserById,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
  mongoIdParam,
} = require('../validators');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfileValidation, validate, updateProfile);
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);
router.get('/users/:id', protect, mongoIdParam('id'), validate, getUserById);

module.exports = router;
