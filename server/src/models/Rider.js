const mongoose = require('mongoose');
const User = require('./User');
const { USER_ROLES } = require('../config/constants');

/**
 * Rider model extends User model with rider-specific fields
 * Note: This is an alternative approach using model inheritance.
 * In the current implementation, we're using a role-based approach
 * within a single User model, so this file serves mainly as a reference.
 */

const riderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    deliveryArea: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalDeliveries: {
      type: Number,
      default: 0
    },
    successfulDeliveries: {
      type: Number,
      default: 0
    },
    vehicleType: {
      type: String,
      enum: ['bicycle', 'motorcycle', 'car', 'van'],
      default: 'motorcycle'
    },
    vehicleNumber: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for geospatial queries
riderSchema.index({ currentLocation: '2dsphere' });

// Virtual for calculating delivery success rate
riderSchema.virtual('successRate').get(function() {
  if (this.totalDeliveries === 0) return 0;
  return (this.successfulDeliveries / this.totalDeliveries) * 100;
});

/**
 * Helper method to create a rider from a user
 * @param {Object} user - User object
 * @param {Object} riderData - Rider-specific data
 * @returns {Promise} Rider object
 */
riderSchema.statics.createFromUser = async function(user, riderData = {}) {
  // Ensure user has rider role
  if (user.role !== USER_ROLES.RIDER) {
    throw new Error('User must have rider role to create rider profile');
  }
  
  // Create rider profile
  const rider = await this.create({
    user: user._id,
    ...riderData
  });
  
  return rider;
};

/**
 * Helper method to find rider by user ID
 * @param {String} userId - User ID
 * @returns {Promise} Rider object
 */
riderSchema.statics.findByUserId = function(userId) {
  return this.findOne({ user: userId }).populate('user');
};

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;