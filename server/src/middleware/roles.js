const { USER_ROLES } = require('../config/constants');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware to check if user has the required role
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return next(new ErrorResponse('User not authenticated', 401));
    }
    
    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    
    next();
  };
};

/**
 * Check if user is admin
 * @param {Object} req - Express request object
 * @returns {Boolean} Is user admin
 */
const isAdmin = (req) => {
  return req.user && req.user.role === USER_ROLES.ADMIN;
};

/**
 * Check if user is rider
 * @param {Object} req - Express request object
 * @returns {Boolean} Is user rider
 */
const isRider = (req) => {
  return req.user && req.user.role === USER_ROLES.RIDER;
};

/**
 * Check if user is customer
 * @param {Object} req - Express request object
 * @returns {Boolean} Is user customer
 */
const isCustomer = (req) => {
  return req.user && req.user.role === USER_ROLES.CUSTOMER;
};

module.exports = {
  checkRole,
  isAdmin,
  isRider,
  isCustomer
};