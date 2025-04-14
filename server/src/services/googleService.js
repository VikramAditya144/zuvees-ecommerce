const { OAuth2Client } = require('google-auth-library');
const client = require('../config/google-oauth');

/**
 * Verify Google ID token
 * @param {String} idToken - Google ID token
 * @returns {Object} User information from Google
 */
exports.verifyGoogleToken = async (idToken) => {
  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    // Get payload data
    const payload = ticket.getPayload();
    
    // Extract user info
    const { sub: googleId, email, name, picture } = payload;
    
    return {
      googleId,
      email,
      name,
      picture
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Failed to verify Google token');
  }
};