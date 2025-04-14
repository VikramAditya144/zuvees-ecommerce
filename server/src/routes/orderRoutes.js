const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { orderValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post(
  '/',
  orderValidators.create,
  validateRequest,
  createOrder
);

router.get('/', getMyOrders);
router.get('/:id', getOrderById);

router.patch(
  '/:id/status',
  orderValidators.updateStatus,
  validateRequest,
  updateOrderStatus
);

router.patch('/:id/cancel', cancelOrder);

module.exports = router;