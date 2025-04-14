const Order = require('../models/Order');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const { getPaginationParams, createResponse, formatOrderResponse } = require('../utils/helpers');
const { ORDER_STATUS } = require('../config/constants');
const ErrorResponse = require('../utils/errorResponse');
const emailService = require('../services/emailService');

/**
 * @desc    Get all orders (admin view)
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { status } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Get total count
    const total = await Order.countDocuments(filter);
    
    // Get orders with pagination
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('assignedRider', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Format order data
    const formattedOrders = orders.map(formatOrderResponse);
    
    // Pagination metadata
    const meta = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json(
      createResponse(true, 'Orders retrieved successfully', formattedOrders, meta)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (admin)
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private (Admin)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(
        new ErrorResponse('Order not found', 404)
      );
    }
    
    // Update order status
    order.status = status;
    
    // Update timestamps for specific status changes
    if (status === ORDER_STATUS.DELIVERED) {
      order.deliveredAt = Date.now();
    } else if (status === ORDER_STATUS.CANCELLED) {
      order.cancelledAt = Date.now();
    }
    
    await order.save();
    
    res.status(200).json(
      createResponse(true, 'Order status updated successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign rider to order
 * @route   PATCH /api/admin/orders/:id/assign
 * @access  Private (Admin)
 */
exports.assignRiderToOrder = async (req, res, next) => {
  try {
    const { riderId } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(
        new ErrorResponse('Order not found', 404)
      );
    }
    
    // Check if order is in PAID status
    if (order.status !== ORDER_STATUS.PAID) {
      return next(
        new ErrorResponse(`Cannot assign rider to order in status: ${order.status}`, 400)
      );
    }
    
    // Check if rider exists and has rider role
    const rider = await User.findOne({
      _id: riderId,
      role: 'rider'
    });
    
    if (!rider) {
      return next(
        new ErrorResponse('Rider not found', 404)
      );
    }
    
    // Assign rider and update status to SHIPPED
    order.assignedRider = rider._id;
    order.status = ORDER_STATUS.SHIPPED;
    
    await order.save();
    
    // Send rider assignment notification
    try {
      await emailService.sendRiderAssignment(order, rider);
    } catch (error) {
      console.error('Failed to send rider assignment notification:', error);
      // Continue execution even if email fails
    }
    
    res.status(200).json(
      createResponse(true, 'Rider assigned successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all approved emails
 * @route   GET /api/admin/approved-emails
 * @access  Private (Admin)
 */
exports.getApprovedEmails = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { role } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add role filter if provided
    if (role) {
      filter.role = role;
    }
    
    // Get total count
    const total = await ApprovedEmail.countDocuments(filter);
    
    // Get approved emails with pagination
    const approvedEmails = await ApprovedEmail.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Pagination metadata
    const meta = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json(
      createResponse(true, 'Approved emails retrieved successfully', approvedEmails, meta)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add approved email
 * @route   POST /api/admin/approved-emails
 * @access  Private (Admin)
 */
exports.addApprovedEmail = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    
    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email });
    
    if (existingEmail) {
      return next(
        new ErrorResponse('Email already approved', 400)
      );
    }
    
    // Create approved email
    const approvedEmail = await ApprovedEmail.create({
      email,
      role,
      addedBy: req.user._id
    });
    
    // Send account approval notification
    try {
      await emailService.sendAccountApproval(email, role);
    } catch (error) {
      console.error('Failed to send account approval notification:', error);
      // Continue execution even if email fails
    }
    
    res.status(201).json(
      createResponse(true, 'Email approved successfully', approvedEmail)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove approved email
 * @route   DELETE /api/admin/approved-emails/:id
 * @access  Private (Admin)
 */
exports.removeApprovedEmail = async (req, res, next) => {
  try {
    const approvedEmail = await ApprovedEmail.findById(req.params.id);
    
    if (!approvedEmail) {
      return next(
        new ErrorResponse('Approved email not found', 404)
      );
    }
    
    await approvedEmail.remove();
    
    res.status(200).json(
      createResponse(true, 'Approved email removed successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get orders by status
    const pendingOrders = await Order.countDocuments({ status: ORDER_STATUS.PENDING });
    const paidOrders = await Order.countDocuments({ status: ORDER_STATUS.PAID });
    const shippedOrders = await Order.countDocuments({ status: ORDER_STATUS.SHIPPED });
    const deliveredOrders = await Order.countDocuments({ status: ORDER_STATUS.DELIVERED });
    const undeliveredOrders = await Order.countDocuments({ status: ORDER_STATUS.UNDELIVERED });
    const cancelledOrders = await Order.countDocuments({ status: ORDER_STATUS.CANCELLED });
    
    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'customer' });
    
    // Get total riders count
    const totalRiders = await User.countDocuments({ role: 'rider' });
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('assignedRider', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get monthly sales data (for current year)
    const currentYear = new Date().getFullYear();
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: { $in: [ORDER_STATUS.PAID, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED] },
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format monthly sales data
    const monthlyData = Array(12).fill().map((_, index) => {
      const monthData = monthlySales.find(item => item._id === index + 1);
      return {
        month: index + 1,
        total: monthData ? monthData.total : 0,
        count: monthData ? monthData.count : 0
      };
    });
    
    res.status(200).json(
      createResponse(true, 'Dashboard stats retrieved successfully', {
        counts: {
          totalOrders,
          pendingOrders,
          paidOrders,
          shippedOrders,
          deliveredOrders,
          undeliveredOrders,
          cancelledOrders,
          totalUsers,
          totalRiders
        },
        recentOrders: recentOrders.map(formatOrderResponse),
        monthlySales: monthlyData
      })
    );
  } catch (error) {
    next(error);
  }
};