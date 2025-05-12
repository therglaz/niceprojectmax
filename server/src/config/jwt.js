const jwt = require('jsonwebtoken');
const { AppError } = require('../middlewares/errorHandler');

// JWT Secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_for_development'; // Replace in production
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // 15 minutes for access token
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // 7 days for refresh token

/**
 * Generate JWT token for a user
 * @param {object} user - User object containing id and other data
 * @param {string} expiresIn - Token expiration time
 * @returns {string} jwt token
 */
const generateToken = (user, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin 
    },
    JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Generate refresh token for a user
 * @param {object} user - User object containing id
 * @returns {string} refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Invalid token', 401);
  }
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  generateToken,
  generateRefreshToken,
  verifyToken
}; 