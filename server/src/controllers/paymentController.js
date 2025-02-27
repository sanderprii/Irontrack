// paymentController.js
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Environment variables

const MERCHANT_NAME = process.env.MERCHANT_NAME;
const API_URL = process.env.API_URL;
const MONTONIO_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://stargate.montonio.com/api'
    : 'https://sandbox-stargate.montonio.com/api';

/**
 * Create a Montonio payment
 */

let affiliateSecretKey = '';
let affiliateAccessKey = '';
const createMontonioPayment = async (req, res) => {
    try {
        // Extract and validate payment data
        const {  amount, orderId, description, userData, affiliateId, appliedCredit, contractId } = req.body;
        const userEmail = userData.email;
        const userPhone = userData.phone;
        const userFullName = userData.fullName;

        const affiliateApiKeys = await prisma.affiliateApiKeys.findFirst({
            where: {
                affiliateId: parseInt(affiliateId)
            }
        });

        affiliateAccessKey = affiliateApiKeys.accessKey;
        affiliateSecretKey = affiliateApiKeys.secretKey;



        // Ensure amount is a valid number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount < 0.01) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a valid number greater than or equal to 0.01"
            });
        }

        // Ensure orderId is provided
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Format amount to have exactly 2 decimal places
        const formattedAmount = parsedAmount.toFixed(2);

        // Create a fully qualified notification URL
        // Montonio requires this to be a public URL, not localhost
        // For production, this should be your actual server URL
        // For testing, you can use a service like ngrok to expose your local server
        const notificationUrl = "https://webhook.site/your-webhook-id"; // Replace with your webhook URL for testing

        // Create the payment data object
        const paymentData = {
            accessKey: affiliateAccessKey,
            merchantReference: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
            returnUrl: `${process.env.FRONTEND_URL}/checkout`,
            notificationUrl: notificationUrl,
            currency: "EUR",
            grandTotal: parseFloat(formattedAmount),
            locale: "et",

            // Optional billing info if available
            billingAddress: {
                email: userEmail,
                phoneNumber: userPhone,
                firstName: userFullName,
            },

            lineItems: [
                {
                    name: description || `Plan purchase: ${MERCHANT_NAME}`,
                    quantity: 1,
                    finalPrice: parseFloat(formattedAmount),
                }
            ],

            // Payment method details
            payment: {
                method: "paymentInitiation",
                methodDisplay: "Make a bank payment",
                methodOptions: {
                    paymentDescription: description || `Plan purchase: ${MERCHANT_NAME}`,
                    preferredCountry: "EE",
                    preferredLocale: "et"
                },
                amount: parseFloat(formattedAmount),
                currency: "EUR"
            },

            // JWT expiration - 10 minutes from now
            exp: Math.floor(Date.now() / 1000) + 10 * 60
        };



        // Generate JWT token
        const token = jwt.sign(
            paymentData,
            affiliateSecretKey,
            { algorithm: 'HS256' }
        );

        // Send request to Montonio
        const response = await axios.post(`${MONTONIO_API_URL}/orders`, {
            data: token
        });

        // Handle success
        console.log("Montonio payment created successfully");

        // Return payment URL to redirect the customer
        return res.status(200).json({
            success: true,
            paymentUrl: response.data.paymentUrl,
            orderUuid: response.data.uuid
        });

    } catch (error) {
        console.error("Error creating Montonio payment:", error);

        // Log detailed error information
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }

        return res.status(500).json({
            success: false,
            message: "Payment creation failed",
            error: error.message
        });
    }
};

/**
 * Handle Montonio webhook notifications
 */
const handleMontonioWebhook = async (req, res) => {
    try {
        const { orderToken } = req.body;

        if (!orderToken) {
            return res.status(400).json({ success: false, message: 'No order token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(orderToken, affiliateSecretKey);

        // Extract order information
        const {
            uuid,
            accessKey,
            merchantReference,
            paymentStatus,
            grandTotal,
            currency,
            senderIban,
            senderName
        } = decodedToken;

        // Verify this is a legitimate request
        if (accessKey !== affiliateAccessKey) {
            console.error('Invalid access key in webhook');
            return res.status(401).json({ success: false, message: 'Invalid access key' });
        }

        console.log(`Payment status update: ${paymentStatus} for order ${merchantReference}`);

        // Extract the orderId from the merchantReference
        const orderIdMatch = merchantReference.match(/order-(\d+)-\d+/);
        const orderId = orderIdMatch ? orderIdMatch[1] : null;

        if (!orderId) {
            console.error('Could not extract order ID from merchant reference:', merchantReference);
            return res.status(400).json({ success: false, message: 'Invalid merchant reference format' });
        }

        // Update the order status in your database based on paymentStatus
        // This is where you'd implement your database update logic
        if (paymentStatus === 'PAID') {
            // Mark the order as paid in your database
            // await updateOrderStatus(orderId, 'paid');
            console.log(`Order ${orderId} marked as paid`);
        } else if (paymentStatus === 'VOIDED') {
            // Mark the order as voided/cancelled in your database
            // await updateOrderStatus(orderId, 'cancelled');
            console.log(`Order ${orderId} marked as voided`);
        } else if (paymentStatus === 'REFUNDED') {
            // Mark the order as refunded in your database
            // await updateOrderStatus(orderId, 'refunded');
            console.log(`Order ${orderId} marked as refunded`);
        } else if (paymentStatus === 'ABANDONED') {
            // Mark the order as abandoned in your database
            // await updateOrderStatus(orderId, 'abandoned');
            console.log(`Order ${orderId} marked as abandoned`);
        }

        // Always respond with 200 OK to acknowledge receipt of the webhook
        return res.status(200).json({
            success: true,
            message: `Successfully processed ${paymentStatus} payment status for order ${orderId}`
        });

    } catch (error) {
        console.error('Error processing Montonio webhook:', error);

        // Still return a 200 status to prevent Montonio from retrying
        // but log the error for debugging
        return res.status(200).json({
            success: false,
            message: 'Error processing webhook but acknowledged',
            error: error.message
        });
    }
};

/**
 * Handle return from Montonio payment page
 */
const handlePaymentReturn = async (req, res) => {
    try {
        const { 'order-token': orderToken } = req.query;

        if (!orderToken) {
            return res.status(400).json({ success: false, message: 'No order token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(orderToken, affiliateSecretKey);

        // Extract and validate payment information
        const { paymentStatus, merchantReference, uuid } = decodedToken;

        // Extract the orderId from the merchantReference
        const orderIdMatch = merchantReference.match(/order-(\d+)-\d+/);
        const orderId = orderIdMatch ? orderIdMatch[1] : null;

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Invalid merchant reference format' });
        }

        // Return the payment status and order information
        return res.status(200).json({
            success: true,
            paymentStatus,
            orderId,
            montonioOrderId: uuid
        });

    } catch (error) {
        console.error('Error handling payment return:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing payment return',
            error: error.message
        });
    }
};

const checkPaymentStatus = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify token with your secret key
        const decoded = jwt.verify(token, affiliateSecretKey);

        // Return payment status
        res.json({
            success: true,
            paymentStatus: decoded.paymentStatus,
            merchantReference: decoded.merchantReference,
            // Add any other fields you need
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = {
    createMontonioPayment,
    handleMontonioWebhook,
    handlePaymentReturn,
    checkPaymentStatus
};