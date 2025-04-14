const Order = require('../models/Order');
const Product = require('../models/Product');
const { getPaginationParams, createResponse, formatOrderResponse } = require('../utils/helpers');
const { ORDER_STATUS } = require('../config/constants');
const ErrorResponse = require('../utils/errorResponse');
const emailService = require('../services/emailService');

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, contactInfo, paymentMethod } = req.body;
    
    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return next(
        new ErrorResponse('No order items', 400)
      );
    }
    
    // Process order items with details
    const processedItems = [];
    const productsToUpdate = new Map(); // Use Map to track unique products to update
    
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return next(
          new ErrorResponse(`Product not found: ${item.product}`, 404)
        );
      }
      
      // Find variant
      const variant = product.variants.id(item.variant);
      
      if (!variant) {
        return next(
          new ErrorResponse(`Variant not found: ${item.variant}`, 404)
        );
      }
      
      // Check stock
      if (variant.stock < item.quantity) {
        return next(
          new ErrorResponse(`Insufficient stock for ${product.name} (${variant.color.name}, ${variant.size})`, 400)
        );
      }
      
      // Add item to order
      processedItems.push({
        product: product._id,
        variant: variant._id,
        name: product.name,
        color: variant.color,
        size: variant.size,
        price: variant.price,
        quantity: item.quantity,
        image: product.images[0]
      });
      
      // Update stock
      variant.stock -= item.quantity;
      productsToUpdate.set(product._id.toString(), product);
    }
    
    // Save product stock changes
    for (const product of productsToUpdate.values()) {
        await product.save();
    }
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: processedItems,
      shippingAddress,
      contactInfo,
      paymentMethod,
      status: ORDER_STATUS.PAID // Mark as paid immediately for simplicity
    });
    
    // Send response
    res.status(201).json(
      createResponse(true, 'Order created successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for the current user
 * @route   GET /api/orders
 * @access  Private
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    
    // Get total count
    const total = await Order.countDocuments({ user: req.user._id });
    
    // Get orders with pagination
    const orders = await Order.find({ user: req.user._id })
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
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedRider', 'name email phone');
    
    if (!order) {
      return next(
        new ErrorResponse('Order not found', 404)
      );
    }
    
    // Check if the user is the owner of the order or an admin/rider
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      (req.user.role !== 'rider' || order.assignedRider?._id.toString() !== req.user._id.toString())
    ) {
      return next(
        new ErrorResponse('Not authorized to access this order', 403)
      );
    }
    
    res.status(200).json(
      createResponse(true, 'Order retrieved successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Customer for cancellation, Admin for other updates)
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
    
    // Check if user is authorized to update status
    if (req.user.role !== 'admin') {
      // If not admin, check if status is being updated to cancelled by the customer
      if (
        status !== ORDER_STATUS.CANCELLED ||
        order.user.toString() !== req.user._id.toString() ||
        order.status !== ORDER_STATUS.PENDING
      ) {
        return next(
          new ErrorResponse('Not authorized to update this order status', 403)
        );
      }
    }
    
    // Update order status
    order.status = status;
    
    // Update timestamps for specific status changes
    if (status === ORDER_STATUS.DELIVERED) {
      order.deliveredAt = Date.now();
    } else if (status === ORDER_STATUS.CANCELLED) {
      order.cancelledAt = Date.now();
      
      // Return items to inventory if cancelled
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        
        if (product) {
          const variant = product.variants.id(item.variant);
          
          if (variant) {
            variant.stock += item.quantity;
            await product.save();
          }
        }
      }
    }
    
    await order.save();
    
    // Send order status update email
    try {
      await emailService.sendOrderStatusUpdate(order, req.user, status);
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      // Continue execution even if email fails
    }
    
    res.status(200).json(
      createResponse(true, 'Order status updated successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(
        new ErrorResponse('Order not found', 404)
      );
    }
    
    // Check if user is the owner of the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(
        new ErrorResponse('Not authorized to cancel this order', 403)
      );
    }
    
    // Check if order can be cancelled
    if (
      order.status !== ORDER_STATUS.PENDING &&
      order.status !== ORDER_STATUS.PAID
    ) {
      return next(
        new ErrorResponse(`Order cannot be cancelled in status: ${order.status}`, 400)
      );
    }
    
    // Update order status
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = Date.now();
    
    // Return items to inventory
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      
      if (product) {
        const variant = product.variants.id(item.variant);
        
        if (variant) {
          variant.stock += item.quantity;
          await product.save();
        }
      }
    }
    
    await order.save();
    
    res.status(200).json(
      createResponse(true, 'Order cancelled successfully', formatOrderResponse(order))
    );
  } catch (error) {
    next(error);
  }
};