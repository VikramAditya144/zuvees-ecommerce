const User = require('../models/User');
const { createResponse } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');
const { ORDER_STATUS } = require('../config/constants');

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Fields allowed to be updated
    const allowedFields = ['name', 'phone', 'address'];
    
    // Update only allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    
    await user.save();
    
    res.status(200).json(
      createResponse(true, 'Profile updated successfully', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        address: user.address,
        phone: user.phone,
        createdAt: user.createdAt
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all approved riders (for admin)
 * @route   GET /api/users/riders
 * @access  Private (Admin)
 */
exports.getRiders = async (req, res, next) => {
  try {
    // Get all riders
    const riders = await User.find({ role: 'rider' })
      .select('_id name email phone profilePicture isActive createdAt');
    
    // Get order stats for each rider
    const ridersWithStats = await Promise.all(
      riders.map(async (rider) => {
        // Get total assigned orders
        const totalAssigned = await Order.countDocuments({
          assignedRider: rider._id
        });
        
        // Get delivered orders count
        const deliveredOrders = await Order.countDocuments({
          assignedRider: rider._id,
          status: ORDER_STATUS.DELIVERED
        });
        
        // Get ongoing orders (shipped but not delivered/undelivered)
        const ongoingOrders = await Order.countDocuments({
          assignedRider: rider._id,
          status: ORDER_STATUS.SHIPPED
        });
        
        // Calculate delivery performance
        const deliveryPerformance = totalAssigned > 0
          ? (deliveredOrders / totalAssigned) * 100
          : 0;
        
        // Get last active time (most recent order update)
        const lastActiveOrder = await Order.findOne({
          assignedRider: rider._id
        })
        .sort({ updatedAt: -1 })
        .limit(1);
        
        const lastActive = lastActiveOrder ? lastActiveOrder.updatedAt : null;
        
        // Return rider with stats
        return {
          ...rider.toObject(),
          stats: {
            totalAssigned,
            deliveredOrders,
            ongoingOrders,
            deliveryPerformance: deliveryPerformance.toFixed(2),
            lastActive
          }
        };
      })
    );
    
    res.status(200).json(
      createResponse(true, 'Riders retrieved successfully', ridersWithStats)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if email exists
 * @route   POST /api/users/check-email
 * @access  Public
 */
exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json(
        createResponse(false, 'Email is required')
      );
    }
    
    const existingUser = await User.findOne({ email });
    
    res.status(200).json(
      createResponse(true, 'Email check successful', {
        exists: !!existingUser
      })
    );
  } catch (error) {
    next(error);
  }
};