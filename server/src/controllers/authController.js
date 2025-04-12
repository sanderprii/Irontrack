const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'salajane_jwt_voti';

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

exports.register = async (req, res) => {
    try {
        const { fullName, phone, address, email, password, affiliateOwner, isAcceptedTerms } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required!' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName: fullName.toUpperCase(),
                phone,
                address,
                affiliateOwner: affiliateOwner || false,
                isAcceptedTerms: isAcceptedTerms || false,
                emailConfirmed: false,
                verificationToken,
                verificationExpires,
            },
        });

        // Generate verification URL
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

        // Email content
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

        // Send verification email
        await sendEmail(
            email,
            'Verify Your Email Address - IronTrack',
            htmlContent
        );

        res.status(201).json({
            message: 'User created! Please check your email to verify your account.',
            user: {
                id: newUser.id,
                email: newUser.email,
                emailConfirmed: false,
            },
        });
    } catch (error) {
        console.error(error);
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

        // Generate JWT token for auto-login
        const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

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
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong during email verification.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required!' });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Check if email is confirmed
        if (!user.emailConfirmed) {
            return res.status(403).json({
                error: 'Please verify your email address before logging in.',
                emailConfirmed: false
            });
        }

        // Verify password
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
        console.error(error);
        res.status(500).json({ error: 'Something went wrong during login.' });
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

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
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong during password reset request.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required.' });
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
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

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
        console.error(error);
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
            const decoded = jwt.verify(token, JWT_SECRET);
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