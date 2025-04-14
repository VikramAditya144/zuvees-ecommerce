const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../config/constants');

// Schema for order items
const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    name: String,
    code: String
  },
  size: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: String
});

// Main order schema
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    contactInfo: {
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Credit Card'
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    },
    assignedRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: Date,
    cancelledAt: Date,
    notes: String,
    trackingNumber: String
  },
  {
    timestamps: true
  }
);

// Virtual for calculating order totals
orderSchema.pre('save', function(next) {
  // Calculate items price
  this.itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Calculate tax (e.g., 5% of items price)
  this.taxPrice = this.itemsPrice * 0.05;
  
  // Calculate shipping (e.g., free shipping for orders over $100)
  this.shippingPrice = this.itemsPrice > 100 ? 0 : 10;
  
  // Calculate total price
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  
  next();
});

// Index for order status queries
orderSchema.index({ status: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ assignedRider: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;