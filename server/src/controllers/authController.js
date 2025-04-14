const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const googleClient = require('../config/google-oauth');
const { USER_ROLES } = require('../config/constants');
const { checkApprovedEmail } = require('../middleware/auth');
const { createResponse } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Google OAuth login
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json(
        createResponse(false, 'Google token is required')
      );
    }
    
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    console.log('Ticket:', ticket);
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    console.log('Payload:', payload);
    
    // Check if email is approved
    const isCustomerApproved = await checkApprovedEmail(email, USER_ROLES.CUSTOMER);
    const isAdminApproved = await checkApprovedEmail(email, USER_ROLES.ADMIN);
    const isRiderApproved = await checkApprovedEmail(email, USER_ROLES.RIDER);
    
    let role = USER_ROLES.CUSTOMER;
    
    if (isAdminApproved) {
      role = USER_ROLES.ADMIN;
    } else if (isRiderApproved) {
      role = USER_ROLES.RIDER;
    } else if (!isCustomerApproved) {
      return res.status(403).json(
        createResponse(false, 'Email not approved for login')
      );
    }
    
    // Find or create user
    let user = await User.findOne({ googleId });
    console.log('User:', user);
    if (!user) {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      console.log('Existing user:', existingUser);
      if (existingUser) {
        // Update existing user with Google ID
        existingUser.googleId = googleId;
        existingUser.profilePicture = existingUser.profilePicture || picture;
        user = await existingUser.save();
      } else {
        // Create new user
        console.log('Creating new user');
        user = await User.create({
          name,
          email,
          googleId,
          profilePicture: picture,
          role,
          isApproved: true
        });
      }
    } else {
      // Update user info if needed
      user.name = name;
      user.email = email;
      user.profilePicture = user.profilePicture || picture;
      user.role = role;
      user.isApproved = true;

      console.log('Updated user:', user);
      
      await user.save();
    }
    
    // Generate JWT token
    const authToken = user.generateAuthToken();
    
    res.status(200).json(
      createResponse(true, 'Login successful', {
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // User is already set in req.user by auth middleware
    const user = req.user;
    
    res.status(200).json(
      createResponse(true, 'User profile retrieved', {
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
 * @desc    Check if email is approved
 * @route   POST /api/auth/check-approval
 * @access  Public
 */
exports.checkEmailApproval = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json(
        createResponse(false, 'Email is required')
      );
    }
    
    // Check if email is approved for any role
    const isCustomerApproved = await checkApprovedEmail(email, USER_ROLES.CUSTOMER);
    const isAdminApproved = await checkApprovedEmail(email, USER_ROLES.ADMIN);
    const isRiderApproved = await checkApprovedEmail(email, USER_ROLES.RIDER);
    
    let approvedRole = null;
    let isApproved = false;
    
    if (isAdminApproved) {
      approvedRole = USER_ROLES.ADMIN;
      isApproved = true;
    } else if (isRiderApproved) {
      approvedRole = USER_ROLES.RIDER;
      isApproved = true;
    } else if (isCustomerApproved) {
      approvedRole = USER_ROLES.CUSTOMER;
      isApproved = true;
    }
    
    res.status(200).json(
      createResponse(true, 'Email approval status retrieved', {
        isApproved,
        role: approvedRole
      })
    );
  } catch (error) {
    next(error);
  }
};