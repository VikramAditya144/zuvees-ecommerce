const User = require('../models/User');
const { createResponse } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

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
    const riders = await User.find({ role: 'rider' })
      .select('_id name email phone profilePicture');
    
    res.status(200).json(
      createResponse(true, 'Riders retrieved successfully', riders)
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