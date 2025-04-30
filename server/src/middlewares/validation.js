const { body, validationResult } = require('express-validator');

/**
 * Validation middleware for registration requests
 * Validates:
 * - Full name format and length
 * - Email format
 * - Password strength
 * - Phone number format
 * - Terms acceptance
 */
const validateRegistration = [
    // Full name validation - allows only letters and spaces
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters long')
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/).withMessage('Name can only contain letters, spaces, and hyphens'),

    // Email validation
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('Email address is too long'),

    // Password validation
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

    // Phone validation (optional)
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 6, max: 20 }).withMessage('Phone number must be between 6-20 characters long')
        .matches(/^[+]?[\d\s()-]{6,20}$/).withMessage('Please enter a valid phone number'),

    // Terms acceptance is required
    body('isAcceptedTerms')
        .isBoolean().withMessage('Terms acceptance value must be boolean')
        .equals('true').withMessage('You must accept the terms and conditions'),

    // Process validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Input validation failed',
                details: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for login requests
 */
const validateLogin = [
    // E-posti valideerimine - minimaalne kontroll
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required'),

    // Parooli valideerimine - ainult kontrolli, et pole tühi
    body('password')
        .notEmpty().withMessage('Password is required'),

    // Töötleme valideerimistulemusi
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Input validation failed',
                details: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for password reset requests
 */
const validatePasswordReset = [
    body('token')
        .notEmpty().withMessage('Token is required'),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Input validation failed',
                details: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for password reset request (email only)
 */
const validatePasswordResetRequest = [
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Input validation failed',
                details: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateRegistration,
    validateLogin,
    validatePasswordReset,
    validatePasswordResetRequest
};