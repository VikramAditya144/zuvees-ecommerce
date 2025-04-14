const mongoose = require('mongoose');
const { USER_ROLES } = require('../config/constants');

const approvedEmailSchema = mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: [USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.RIDER],
      required: [true, 'Please specify a role for this approved email']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const ApprovedEmail = mongoose.model('ApprovedEmail', approvedEmailSchema);

module.exports = ApprovedEmail;