const { verifyToken } = require('../config/jwt');
const User = require('../models/user.model');
const { AppError } = require('./errorHandler');

/**
 * Authentication middleware to protect routes
 * - Extracts JWT from Authorization header
 * - Verifies token and attaches user to request object
 */
const authenticate = async (req, res, next) => {
  try {
    // 1) Check if token exists in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // 2) Extract and verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // 3) Check if user still exists
    const user = await User.query().findById(decoded.userId);
    if (!user) {
      return next(new AppError('The user with this token no longer exists.', 401));
    }

    // 4) Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware to restrict access to admin users only
 * Must be used after the authenticate middleware
 */
const restrictToAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

module.exports = {
  authenticate,
  restrictToAdmin
}; 