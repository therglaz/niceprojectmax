const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user and get JWT token
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token using refresh token
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Request password reset email
 * @access Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route GET /api/v1/auth/verify/:token
 * @desc Verify user email with token
 * @access Public
 */
router.get('/verify/:token', authController.verifyEmail);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user profile
 * @access Protected
 */
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router; 