const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { productValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  productValidators.create,
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  productValidators.update,
  validateRequest,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteProduct
);

module.exports = router;