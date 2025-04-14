const express = require('express');
const { 
  googleLogin, 
  getCurrentUser,
  checkEmailApproval
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/google', googleLogin);
router.post('/check-approval', checkEmailApproval);

// Protected routes
router.get('/me', protect, getCurrentUser);

module.exports = router;