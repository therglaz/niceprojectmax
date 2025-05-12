const User = require('../models/user.model');
const { generateToken, generateRefreshToken } = require('../config/jwt');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      return next(new AppError('Email is already registered.', 400));
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = await User.query().insert({
      email,
      password, // Will be hashed by the model
      firstName,
      lastName,
      verificationToken,
      verificationStatus: 'pending'
    });

    logger.info(`New user registered: ${email}`);

    // Send verification email - to be implemented in email service
    // await sendVerificationEmail(user);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and generate JWT token
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password.', 400));
    }

    // Find user by email
    const user = await User.query().findOne({ email });

    // Check if user exists and password is correct
    if (!user || !(await user.verifyPassword(password))) {
      return next(new AppError('Incorrect email or password.', 401));
    }

    // Check if user is verified
    if (user.verificationStatus !== 'verified') {
      return next(new AppError('Please verify your email before logging in.', 401));
    }

    // Update last login time
    await User.query().findById(user.id).patch({
      lastLoginAt: new Date().toISOString()
    });

    // Generate JWT tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        expiresIn: 900, // 15 minutes in seconds
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using refresh token
 * @route POST /api/v1/auth/refresh
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required.', 400));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Check if user exists
    const user = await User.query().findById(decoded.userId);
    if (!user) {
      return next(new AppError('Invalid refresh token.', 401));
    }

    // Generate new access token
    const accessToken = generateToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        expiresIn: 900 // 15 minutes in seconds
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired refresh token.', 401));
    }
    next(error);
  }
};

/**
 * Request password reset email
 * @route POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Please provide your email address.', 400));
    }

    // Find user by email
    const user = await User.query().findOne({ email });
    if (!user) {
      // Return success regardless to prevent email enumeration attacks
      return res.status(200).json({
        status: 'success',
        message: 'If the email exists, a password reset link will be sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token expiry (24 hours from now)
    const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Update user with reset token
    await User.query().findById(user.id).patch({
      resetPasswordToken: resetToken,
      resetTokenExpiresAt
    });

    // Send password reset email - to be implemented in email service
    // await sendPasswordResetEmail(user, resetToken);

    logger.info(`Password reset requested for: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'If the email exists, a password reset link will be sent.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using token from email
 * @route POST /api/v1/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(new AppError('Token and new password are required.', 400));
    }

    // Find user with this token and valid expiry
    const user = await User.query().findOne({
      resetPasswordToken: token,
      resetTokenExpiresAt: User.raw('> NOW()')
    });

    if (!user) {
      return next(new AppError('Invalid or expired token.', 400));
    }

    // Update user's password and clear reset token
    await User.query().findById(user.id).patch({
      password, // Will be hashed by the model
      resetPasswordToken: null,
      resetTokenExpiresAt: null
    });

    logger.info(`Password reset completed for: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user email with token
 * @route GET /api/v1/auth/verify/:token
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find user with this verification token
    const user = await User.query().findOne({ verificationToken: token });

    if (!user) {
      return next(new AppError('Invalid verification token.', 400));
    }

    // Update user verification status and clear token
    await User.query().findById(user.id).patch({
      verificationStatus: 'verified',
      verificationToken: null
    });

    logger.info(`Email verified for: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now log in to your account.'
    });
  } catch (error) {
    next(error);
  }
}; 