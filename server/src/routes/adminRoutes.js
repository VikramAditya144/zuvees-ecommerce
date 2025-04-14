const express = require('express');
const {
  getAllOrders,
  updateOrderStatus,
  assignRiderToOrder,
  getApprovedEmails,
  addApprovedEmail,
  removeApprovedEmail,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { orderValidators, approvedEmailValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Orders
router.get('/orders', getAllOrders);

router.patch(
  '/orders/:id/status',
  orderValidators.updateStatus,
  validateRequest,
  updateOrderStatus
);

router.patch(
  '/orders/:id/assign',
  orderValidators.assignRider,
  validateRequest,
  assignRiderToOrder
);

// Approved emails
router.get('/approved-emails', getApprovedEmails);

router.post(
  '/approved-emails',
  approvedEmailValidators.create,
  validateRequest,
  addApprovedEmail
);

router.delete('/approved-emails/:id', removeApprovedEmail);

// Dashboard
router.get('/dashboard', getDashboardStats);

module.exports = router;