const Order = require('../models/Order');
const { getPaginationParams, createResponse, formatOrderResponse } = require('../utils/helpers');
const { ORDER_STATUS } = require('../config/constants');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get rider's assigned orders
 * @route   GET /api/rider/orders
 * @access  Private (Rider)
 */
exports.getAssignedOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { status } = req.query;
    
    // Build filter object
    const filter = {
      assignedRider: req.user._id
    };
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Get total count
    const total = await Order.countDocuments(filter);
    
    // Get assigned orders with pagination
    const orders = await Order.find(filter)
      .populate('user', 'name email phone address')
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
      createResponse(true, 'Assigned orders retrieved successfully', formattedOrders, meta)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (Rider can only change from SHIPPED to DELIVERED or UNDELIVERED)
 * @route   PATCH /api/rider/orders/:id/status
 * @access  Private (Rider)
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (
      status !== ORDER_STATUS.DELIVERED &&
      status !== ORDER_STATUS.UNDELIVERED
    ) {
      return next(
        new ErrorResponse('Riders can only mark orders as Delivered or Undelivered', 400)
      );
    }
    
    const order = await Order.findOne({
      _id: req.params.id,
      assignedRider: req.user._id
    });
    
    if (!order) {
      return next(
        new ErrorResponse('Order not found or not assigned to this rider', 404)
      );
    }
    
    // Check if order is in SHIPPED status
    if (order.status !== ORDER_STATUS.SHIPPED) {
      return next(
        new ErrorResponse(`Cannot update order in status: ${order.status}`, 400)
      );
    }
    
    // Update order status
    order.status = status;
    
    // Update delivery timestamp if delivered
    if (status === ORDER_STATUS.DELIVERED) {
      order.deliveredAt = Date.now();
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
 * @desc    Get rider dashboard stats
 * @route   GET /api/rider/dashboard
 * @access  Private (Rider)
 */
exports.getRiderDashboard = async (req, res, next) => {
  try {
    // Get total assigned orders
    const totalAssigned = await Order.countDocuments({
      assignedRider: req.user._id
    });
    
    // Get orders by status
    const shippedOrders = await Order.countDocuments({
      assignedRider: req.user._id,
      status: ORDER_STATUS.SHIPPED
    });
    
    const deliveredOrders = await Order.countDocuments({
      assignedRider: req.user._id,
      status: ORDER_STATUS.DELIVERED
    });
    
    const undeliveredOrders = await Order.countDocuments({
      assignedRider: req.user._id,
      status: ORDER_STATUS.UNDELIVERED
    });
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.countDocuments({
      assignedRider: req.user._id,
      updatedAt: { $gte: today }
    });
    
    // Get recent assigned orders
    const recentOrders = await Order.find({
      assignedRider: req.user._id
    })
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Calculate delivery performance
    const deliveryPerformance = totalAssigned > 0
      ? (deliveredOrders / totalAssigned) * 100
      : 0;
    
    res.status(200).json(
      createResponse(true, 'Rider dashboard stats retrieved successfully', {
        counts: {
          totalAssigned,
          shippedOrders,
          deliveredOrders,
          undeliveredOrders,
          todayOrders
        },
        performance: {
          deliveryRate: deliveryPerformance.toFixed(2)
        },
        recentOrders: recentOrders.map(formatOrderResponse)
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details (Rider view)
 * @route   GET /api/rider/orders/:id
 * @access  Private (Rider)
 */
exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      assignedRider: req.user._id
    }).populate('user', 'name email phone address');
    
    if (!order) {
      return next(
        new ErrorResponse('Order not found or not assigned to this rider', 404)
      );
    }
    
    res.status(200).json(
      createResponse(true, 'Order details retrieved successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};