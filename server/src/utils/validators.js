const { body, param, query } = require('express-validator');
const { ORDER_STATUS, PRODUCT_CATEGORIES } = require('../config/constants');

// Product validators
exports.productValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 100 })
      .withMessage('Product name cannot exceed 100 characters'),
    
    body('description')
      .notEmpty()
      .withMessage('Product description is required'),
      
    body('category')
      .notEmpty()
      .withMessage('Product category is required')
      .isIn(Object.values(PRODUCT_CATEGORIES))
      .withMessage('Invalid product category'),
      
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('Brand name is required'),
      
    body('images')
      .isArray({ min: 1 })
      .withMessage('At least one image URL is required'),
      
    body('variants')
      .isArray({ min: 1 })
      .withMessage('At least one variant is required'),
      
    body('variants.*.color.name')
      .notEmpty()
      .withMessage('Color name is required for each variant'),
      
    body('variants.*.color.code')
      .notEmpty()
      .withMessage('Color code is required for each variant')
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color code must be a valid hex color'),
      
    body('variants.*.size')
      .notEmpty()
      .withMessage('Size is required for each variant'),
      
    body('variants.*.price')
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Price must be non-negative'),
      
    body('variants.*.stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
      
    body('variants.*.sku')
      .notEmpty()
      .withMessage('SKU is required for each variant')
  ],
  
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID format')
  ]
};

// Order validators
exports.orderValidators = {
  create: [
    body('orderItems')
      .isArray({ min: 1 })
      .withMessage('At least one order item is required'),
      
    body('orderItems.*.product')
      .isMongoId()
      .withMessage('Valid product ID is required for each item'),
      
    body('orderItems.*.variant')
      .isMongoId()
      .withMessage('Valid variant ID is required for each item'),
      
    body('orderItems.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1 for each item'),
      
    body('shippingAddress.street')
      .notEmpty()
      .withMessage('Street address is required'),
      
    body('shippingAddress.city')
      .notEmpty()
      .withMessage('City is required'),
      
    body('shippingAddress.state')
      .notEmpty()
      .withMessage('State is required'),
      
    body('shippingAddress.zipCode')
      .notEmpty()
      .withMessage('Zip code is required'),
      
    body('shippingAddress.country')
      .notEmpty()
      .withMessage('Country is required'),
      
    body('contactInfo.phone')
      .notEmpty()
      .withMessage('Phone number is required'),
      
    body('contactInfo.email')
      .isEmail()
      .withMessage('Valid email is required'),
      
    body('paymentMethod')
      .notEmpty()
      .withMessage('Payment method is required')
  ],
  
  updateStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID format'),
      
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(Object.values(ORDER_STATUS))
      .withMessage('Invalid order status')
  ],
  
  assignRider: [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID format'),
      
    body('riderId')
      .isMongoId()
      .withMessage('Invalid rider ID format')
  ]
};

// User validators
exports.userValidators = {
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty if provided'),
      
    body('phone')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Phone cannot be empty if provided'),
      
    body('address.street')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Street address cannot be empty if provided'),
      
    body('address.city')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('City cannot be empty if provided'),
      
    body('address.state')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('State cannot be empty if provided'),
      
    body('address.zipCode')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Zip code cannot be empty if provided'),
      
    body('address.country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Country cannot be empty if provided')
  ]
};

// Approved Email validators
exports.approvedEmailValidators = {
  create: [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),
      
    body('role')
      .notEmpty()
      .withMessage('Role is required')
  ]
};