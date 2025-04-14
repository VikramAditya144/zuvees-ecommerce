const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { USER_ROLES, JWT_EXPIRATION } = require('../config/constants');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    profilePicture: {
      type: String
    },
    role: {
      type: String,
      enum: [USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.RIDER],
      default: USER_ROLES.CUSTOMER
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    phone: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

// Check if user has required role
userSchema.methods.hasRole = function(role) {
  return this.role === role;
};

const User = mongoose.model('User', userSchema);

module.exports = User;