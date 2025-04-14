const express = require('express');
const {
  updateProfile,
  getRiders,
  checkEmail
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { userValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Public routes
router.post('/check-email', checkEmail);

// Protected routes
router.patch(
  '/profile',
  protect,
  userValidators.updateProfile,
  validateRequest,
  updateProfile
);

// Admin routes
router.get(
  '/riders',
  protect,
  authorize('admin'),
  getRiders
);

module.exports = router;