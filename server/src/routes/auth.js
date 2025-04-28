const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
    validateRegistration,
    validateLogin,
    validatePasswordReset,
    validatePasswordResetRequest
} = require('../middlewares/validation');
const ensureAuthenticatedJWT = require('../middlewares/ensureAuthenticatedJWT');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRegistration, authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route GET /api/auth/me
 * @desc Get current user information
 * @access Private
 */
router.get('/me', ensureAuthenticatedJWT, authController.getMe);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user email with token
 * @access Public
 */
router.get('/verify-email', authController.verifyEmail);

/**
 * @route POST /api/auth/request-password-reset
 * @desc Request a password reset link
 * @access Public
 */
router.post('/request-password-reset', validatePasswordResetRequest, authController.requestPasswordReset);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', validatePasswordReset, authController.resetPassword);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (invalidate token)
 * @access Private
 */
router.post('/logout', ensureAuthenticatedJWT, authController.logout);

router.post('/validate-email', authController.validateEmail);
router.post('/validate-email-async', authController.validateEmailAsync);
router.get('/validate-email-status/:verificationId', authController.getAsyncValidationStatus);

module.exports = router;