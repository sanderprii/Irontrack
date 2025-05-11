const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '24h'; // Set a reasonable token expiry time

// MailerSend config
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});
const defaultSender = new Sender("info@irontrack.ee", "IronTrack");

// Helper function to send emails
const sendEmail = async (to, subject, htmlContent, textContent) => {
    try {
        const emailParams = new EmailParams()
            .setFrom(defaultSender)
            .setTo([new Recipient(to)])
            .setSubject(subject)
            .setHtml(htmlContent)
            .setText(textContent || htmlContent.replace(/<[^>]*>/g, ''));

        const response = await mailerSend.email.send(emailParams);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
};

// User registration with enhanced security
exports.register = async (req, res) => {
    try {
        const { fullName, phone, address, email, password, affiliateOwner, isAcceptedTerms, captchaToken } = req.body;

        // Get client IP for tracking
        const clientIP = req.clientIP || req.ip || 'unknown';

        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required!' });
        }

        // 2. Enhanced email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }

        // 3. Block temporary email domains
        const domain = email.split('@')[1];
        const temporaryEmailDomains = ['tempmail.com', 'temp-mail.org', 'guerrillamail.com', 'mailinator.com', 'yopmail.com', '10minutemail.com'];
        if (temporaryEmailDomains.some(tempDomain => domain.includes(tempDomain))) {
            return res.status(400).json({ error: 'Temporary email addresses are not allowed.' });
        }

        // 4. Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
            return res.status(400).json({
                error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
            });
        }

        // 5. Check for terms acceptance
        if (!isAcceptedTerms) {
            return res.status(400).json({ error: 'You must accept the terms and conditions.' });
        }

        // 6. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            // Add a delay to prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(400).json({ error: 'User with this email already exists!' });
        }

        // 7. Hash password with strong settings
        const saltRounds = 12; // Higher number = more secure but slower
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 8. Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // 9. Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: fullName ? fullName.trim() : '',
                phone,
                address,
                affiliateOwner: affiliateOwner || false,
                isAcceptedTerms: isAcceptedTerms || false,
                emailConfirmed: false,
                verificationToken,
                verificationExpires,
            },
        });

        // 10. Log registration attempt
        console.log(`New user registration: ${email} from IP: ${clientIP}`);

        // 11. Generate verification URL
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

        // 12. Email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #333;">Verify Your Email</h1>
                </div>
                <div style="color: #666; line-height: 1.5;">
                    <p>Hello ${fullName || 'there'},</p>
                    <p>Thank you for registering with IronTrack. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you did not create an account with IronTrack, please ignore this email.</p>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; color: #999; font-size: 12px; text-align: center;">
                    <p>© ${new Date().getFullYear()} IronTrack. All rights reserved.</p>
                </div>
            </div>
        `;

        // 13. Send verification email
        await sendEmail(
            email,
            'Verify Your Email Address - IronTrack',
            htmlContent
        );

        // 14. Return success response
        res.status(201).json({
            message: 'User created! Please check your email to verify your account.',
            user: {
                id: newUser.id,
                email: newUser.email,
                emailConfirmed: false,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Something went wrong during registration.' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required.' });
        }

        // Find user with the token
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        // Update user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailConfirmed: true,
                verificationToken: null,
                verificationExpires: null
            }
        });

        // Generate JWT token with improved security
        const jwtToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                iat: Math.floor(Date.now() / 1000)
            },
            JWT_SECRET,
            {
                expiresIn: '1h',
                algorithm: 'HS256'
            }
        );

        return res.status(200).json({
            message: 'Email verified successfully!',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                emailConfirmed: true,
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({ error: 'Something went wrong during email verification.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const clientIP = req.clientIP || req.ip || 'unknown';

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required!' });
        }

        // Find user - Otsime andmebaasist kasutajat ilma e-posti normaliseerimiseta
        // Variant 1: Otsi täpselt sisestatud e-posti järgi
        const user = await prisma.user.findUnique({
            where: { email: email.trim() }
        });

        // Variant 2: Kui variant 1 ei leia kasutajat, proovi tõstutundetut võrdlust
        // Seda võib kasutada, kui vaja, aga tavaliselt pole vajalik
        /*
        if (!user) {
            // Otsi kõik kasutajad ja võrdle e-posti aadresse tõstutundetult
            const allUsers = await prisma.user.findMany();
            const matchedUser = allUsers.find(u =>
                u.email.toLowerCase() === email.toLowerCase().trim()
            );

            if (matchedUser) {
                user = matchedUser;
            }
        }
        */

        if (!user) {
            console.log(`Failed login attempt for email: ${email} from IP: ${clientIP} - User not found`);
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Check if email is confirmed
        if (!user.emailConfirmed) {
            console.log(`Failed login attempt for email: ${email} from IP: ${clientIP} - Email not confirmed`);
            return res.status(403).json({
                error: 'Please verify your email address before logging in.',
                emailConfirmed: false
            });
        }



        // Verify password - kasuta lihtsalt bcrypt.compare ilma muude tingimusteta
        const isMatch = await bcrypt.compare(password, user.password);



        if (!isMatch) {

            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '365d' });

        const userRole = user.affiliateOwner ? 'affiliate' : 'regular';

        res.status(200).json({
            message: 'Login successful',
            token,
            role: userRole,
            userId: user.id,
            pricingPlan: user.pricingPlan,
            user: {
                id: user.id,
                email: user.email,
                affiliateOwner: user.affiliateOwner,
                emailConfirmed: user.emailConfirmed
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Something went wrong during login.' });
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const clientIP = req.clientIP || req.ip || 'unknown';

        // Add a small delay to prevent timing attacks
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        console.log("password reset attempt", { email });

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });



        if (!user) {
            // For security reasons, don't reveal that the email doesn't exist

            return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour



        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpires
            }
        });

        // Generate reset URL
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #333;">Reset Your Password</h1>
                </div>
                <div style="color: #666; line-height: 1.5;">
                    <p>Hello ${user.fullName || 'there'},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetUrl}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; color: #999; font-size: 12px; text-align: center;">
                    <p>© ${new Date().getFullYear()} IronTrack. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send reset email
        await sendEmail(
            email,
            'Reset Your Password - IronTrack',
            htmlContent
        );


        return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link.' });
    } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({ error: 'Something went wrong during password reset request.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const clientIP = req.clientIP || req.ip || 'unknown';

        console.log("password reset attempt", { token, password });

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required.' });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
            return res.status(400).json({
                error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
            });
        }

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            console.log(`Invalid password reset attempt with token: ${token.substring(0, 10)}... from IP: ${clientIP}`);
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        // Hash new password with stronger settings
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user's password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        });


        return res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ error: 'Something went wrong during password reset.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Improved token extraction
        let token;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader; // Try using the header value directly
        }

        // Ensure token exists
        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        try {
            // Verify token with explicit algorithm
            const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

            if (!decoded?.userId) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Find user in DB
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isTrainer = await prisma.affiliateTrainer.findFirst({
                where: {
                    trainerId: user.id,
                },
            });

            return res.json({
                id: user.id,
                email: user.email,
                affiliateOwner: user.affiliateOwner,
                isTrainer: !!isTrainer,
                emailConfirmed: user.emailConfirmed
            });
        } catch (jwtError) {
            // Specifically handle JWT verification errors
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// New logout endpoint to invalidate tokens
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ error: 'No token provided' });
        }

        let token;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader;
        }

        // Optionally track the invalidated token in a database
        // This would require adding a RevokedToken model to your Prisma schema
        /* Uncomment and modify this section if you implement RevokedToken in Prisma
        try {
            const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

            // Get expiration time from token
            const exp = decoded.exp * 1000; // Convert to milliseconds

            // Add to revoked tokens list with expiry time
            await prisma.revokedToken.create({
                data: {
                    token,
                    expiresAt: new Date(exp)
                }
            });
        } catch (error) {
            // If token is invalid, no need to revoke it
            console.error("Token validation error during logout:", error);
        }
        */

        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Server error during logout' });
    }
};

// Add these functions to your authController.js file

// Synchronous email validation (blocks until validation completes)
exports.validateEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Create API request to MailerSend
        const response = await fetch('https://api.mailersend.com/v1/email-verification/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        // Check for errors
        if (response.status === 402) {
            return res.status(402).json({ error: 'Not enough credits for email verification.' });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Email verification failed', details: data });
        }

        // Handle successful validation and categorize results
        let category = 'unknown';
        if (data.status === 'valid') {
            category = 'valid';
        } else if (['catch_all', 'mailbox_full', 'role_based', 'unknown'].includes(data.status)) {
            category = 'risky';
        } else if (['syntax_error', 'typo', 'mailbox_not_found', 'disposables', 'mailbox_blocked', 'failed'].includes(data.status)) {
            category = 'invalid';
        }

        return res.status(200).json({
            result: data.status,
            category,
            valid: data.status === 'valid',
            details: getEmailStatusDescription(data.status)
        });
    } catch (error) {
        console.error('Email validation error:', error);
        return res.status(500).json({ error: 'Something went wrong during email validation.' });
    }
};

// Asynchronous email validation (returns immediately, check status later)
exports.validateEmailAsync = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Create API request to MailerSend
        const response = await fetch('https://api.mailersend.com/v1/email-verification/verify-async', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        // Check for errors
        if (response.status === 402) {
            return res.status(402).json({ error: 'Not enough credits for email verification.' });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Email verification request failed', details: data });
        }

        // Return verification ID for later status checks
        return res.status(200).json({
            message: 'Email verification started',
            verificationId: data.id,
            status: data.status,
            email: data.address
        });
    } catch (error) {
        console.error('Async email validation error:', error);
        return res.status(500).json({ error: 'Something went wrong during async email validation.' });
    }
};

// Check the status of an asynchronous email validation
exports.getAsyncValidationStatus = async (req, res) => {
    try {
        const { verificationId } = req.params;

        if (!verificationId) {
            return res.status(400).json({ error: 'Verification ID is required.' });
        }

        // Create API request to MailerSend
        const response = await fetch(`https://api.mailersend.com/v1/email-verification/verify-async/${verificationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to get verification status', details: data });
        }

        // Process the response
        let category = 'unknown';
        let isComplete = data.status === 'completed';

        if (isComplete && data.result) {
            if (data.result === 'valid') {
                category = 'valid';
            } else if (['catch_all', 'mailbox_full', 'role_based', 'unknown'].includes(data.result)) {
                category = 'risky';
            } else if (['syntax_error', 'typo', 'mailbox_not_found', 'disposables', 'mailbox_blocked', 'failed'].includes(data.result)) {
                category = 'invalid';
            }
        }

        return res.status(200).json({
            id: data.id,
            email: data.address,
            status: data.status,
            result: data.result,
            error: data.error,
            category: isComplete ? category : 'pending',
            complete: isComplete,
            details: isComplete && data.result ? getEmailStatusDescription(data.result) : null
        });
    } catch (error) {
        console.error('Get validation status error:', error);
        return res.status(500).json({ error: 'Something went wrong while checking validation status.' });
    }
};

// Helper function to verify an email (for internal use)
const verifyEmailInternal = async (email) => {
    try {
        const response = await fetch('https://api.mailersend.com/v1/email-verification/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Email verification failed:', data);
            return { status: 'error', error: data };
        }

        return { status: data.status };
    } catch (error) {
        console.error('Internal email verification error:', error);
        return { status: 'error', error: error.message };
    }
};

// Utility function to get human-readable descriptions for email statuses
const getEmailStatusDescription = (status) => {
    const descriptions = {
        // Valid
        'valid': 'Email is safe to send.',

        // Risky
        'catch_all': 'Mail server will accept emails to this address, but we cannot guarantee this email belongs to a real person.',
        'mailbox_full': 'Recipient\'s inbox is full and may not be able to receive new emails.',
        'role_based': 'Email is role-based (e.g., info@, support@) and may not be associated with a single person.',
        'unknown': 'Unable to determine if the email is valid or not.',

        // Invalid
        'syntax_error': 'The email address format is not valid.',
        'typo': 'The email address has a typo. Correct the email address and retest.',
        'mailbox_not_found': 'Recipient\'s inbox does not exist.',
        'disposables': 'The email address is a temporary inbox and should be removed from your lists.',
        'mailbox_blocked': 'The email address\' mailbox is blocked by its service provider.',
        'failed': 'Verification failed due to timeouts or other technical issues.'
    };

    return descriptions[status] || 'Unknown status';
};

// Modify your existing register function to include email validation
const originalRegister = exports.register;
exports.register = async (req, res) => {
    try {
        const { email } = req.body;

        // Only proceed with validation if we have an email
        if (email) {
            // Validate the email first
            const verification = await verifyEmailInternal(email);



            // If the email is clearly invalid, reject the registration
            if (['syntax_error', 'disposables', 'mailbox_blocked'].includes(verification.status)) {
                return res.status(400).json({
                    error: 'Email validation failed',
                    details: getEmailStatusDescription(verification.status),
                    status: verification.status
                });
            }

            // Optional: You could add warnings for risky emails but still allow registration
            // This is now stored in the request for use in the original function
            req.emailValidation = verification;
        }

        // Proceed with the original registration logic
        return await originalRegister(req, res);
    } catch (error) {
        console.error('Registration with validation error:', error);
        return res.status(500).json({ error: 'Something went wrong during registration.' });
    }
};