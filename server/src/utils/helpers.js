/**
 * Helper functions for the application
 */

const { DEFAULT_PAGE_SIZE } = require('../config/constants');

/**
 * Parse pagination parameters
 * @param {Object} query - Express request query object
 * @returns {Object} Pagination parameters
 */
exports.getPaginationParams = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * limit;
  
  return {
    page,
    limit,
    skip
  };
};

/**
 * Create standard API response
 * @param {Boolean} success - Success status
 * @param {String} message - Response message
 * @param {Object} data - Response data
 * @param {Object} meta - Metadata (pagination, etc.)
 * @returns {Object} Formatted response
 */
exports.createResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (meta !== null) {
    response.meta = meta;
  }
  
  return response;
};

/**
 * Format product data for response
 * @param {Object} product - Mongoose product document
 * @returns {Object} Formatted product data
 */
exports.formatProductResponse = (product) => {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    images: product.images,
    variants: product.variants.map(variant => ({
      id: variant._id,
      color: variant.color,
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      sku: variant.sku
    })),
    features: product.features,
    specifications: product.specifications ? Object.fromEntries(product.specifications) : {},
    rating: product.rating,
    numReviews: product.numReviews,
    basePrice: product.basePrice,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

/**
 * Format order data for response
 * @param {Object} order - Mongoose order document
 * @returns {Object} Formatted order data
 */
exports.formatOrderResponse = (order) => {
  return {
    id: order._id,
    user: order.user,
    orderItems: order.orderItems.map(item => ({
      id: item._id,
      product: item.product,
      variant: item.variant,
      name: item.name,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })),
    shippingAddress: order.shippingAddress,
    contactInfo: order.contactInfo,
    paymentMethod: order.paymentMethod,
    paymentResult: order.paymentResult,
    itemsPrice: order.itemsPrice,
    taxPrice: order.taxPrice,
    shippingPrice: order.shippingPrice,
    totalPrice: order.totalPrice,
    status: order.status,
    assignedRider: order.assignedRider,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    notes: order.notes,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
};