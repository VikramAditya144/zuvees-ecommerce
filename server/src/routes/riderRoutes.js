const express = require('express');
const {
  getAssignedOrders,
  updateOrderStatus,
  getRiderDashboard,
  getOrderDetails
} = require('../controllers/riderController');
const { protect, authorize } = require('../middleware/auth');
const { orderValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All rider routes are protected and require rider role
router.use(protect);
router.use(authorize('rider'));

// Orders
router.get('/orders', getAssignedOrders);
router.get('/orders/:id', getOrderDetails);

router.patch(
  '/orders/:id/status',
  orderValidators.updateStatus,
  validateRequest,
  updateOrderStatus
);

// Dashboard
router.get('/dashboard', getRiderDashboard);

module.exports = router;