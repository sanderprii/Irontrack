// paymentController.js
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NOTIFICATION_URL = process.env.NOTIFICATION_URL;

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
        const { amount, orderId, description, userData, affiliateId, appliedCredit, contractId } = req.body;
        const userEmail = userData?.email || '';
        const userPhone = userData?.phone || '';
        const userFullName = userData?.fullName || '';

        if (!affiliateId) {
            return res.status(400).json({
                success: false,
                message: "AffiliateId is required"
            });
        }

        const parsedAffiliateId = parseInt(affiliateId);
        if (isNaN(parsedAffiliateId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid affiliateId format - must be a number"
            });
        }



        const affiliateApiKeys = await prisma.affiliateApiKeys.findFirst({
            where: {
                affiliateId: parsedAffiliateId
            }
        });

        if (!affiliateApiKeys) {
            console.error(`API keys not found for affiliate ID ${parsedAffiliateId}`);
            return res.status(404).json({
                success: false,
                message: "Payment configuration not found for this affiliate"
            });
        }

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
        const notificationUrl = `${NOTIFICATION_URL}/api/payments/montonio-webhook`;

        // Loome unique merchantReference, mis sisaldab ka lepingu ID-d kui see on olemas
        const merchantReference = contractId
            ? `contract-${contractId}-${new Date().getTime()}`
            : new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

        // Create the payment data object
        const paymentData = {
            accessKey: affiliateAccessKey,
            merchantReference: merchantReference,
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



        // Kui tegemist on lepingumaksega (contractId on olemas), siis loome paymentMetadata kirje
        if (contractId) {
            try {
                // Loome transaktsiooni kirje
                const transaction = await prisma.transactions.create({
                    data: {
                        userId: userData.id,
                        affiliateId: parsedAffiliateId,
                        amount: parsedAmount,
                        invoiceNumber: merchantReference,
                        description: `Contract payment: ${description || 'Contract Payment'}`,
                        type: 'contract',
                        status: 'pending'
                    }
                });



                // Salvestame payment metadata
                await prisma.paymentMetadata.create({
                    data: {
                        transactionId: transaction.id,
                        montonioUuid: response.data.uuid,
                        contractId: parseInt(contractId),
                        affiliateId: parsedAffiliateId,
                        isPaymentHoliday: false
                    }
                });


            } catch (dbError) {
                console.error("Error creating payment metadata:", dbError);
                // Isegi kui metadata kirjutamine ebaõnnestub, laseme maksel jätkuda
            }
        }

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
// Part of paymentController.js - Handling payment holidays in webhook
const handleMontonioWebhook = async (req, res) => {
    try {
        const { orderToken } = req.body;

        if (!orderToken) {
            console.log('No order token provided');
            return res.status(200).json({ success: false, message: 'No order token provided' });
        }

        // Proovi kõigepealt dekodeerida ilma kinnitamiseta, et saada uuid
        let decodedToken;
        try {
            decodedToken = jwt.decode(orderToken);

            if (!decodedToken || !decodedToken.paymentLinkUuid) {
                console.log('Invalid token format or missing UUID');
                return res.status(200).json({ success: false, message: 'Invalid token format' });
            }

            // Kasuta uuid-d paymentLinkUuid asemel
            const orderUuid = decodedToken.paymentLinkUuid;  // UUID on otseselt decodedToken.uuid-s, mitte paymentLinkUuid-s
            console.log(`Processing webhook for order UUID: ${orderUuid}`);
console.log(decodedToken)
            // Lepingu maksete jaoks otsime paymentMetadata
            const paymentMetadata = await prisma.paymentMetadata.findFirst({
                where: { montonioUuid: orderUuid }
            });

            // Kui metadata puudub, ei pruugi see olla leping vaid tavalise paketi ost
            if (!paymentMetadata) {
                console.log(`No payment metadata found for UUID ${orderUuid}, processing as regular payment`);

                // Leia AffiliateApiKeys, kui võimalik
                // Vajalik token verifitseerimiseks
                const apiKeys = await prisma.affiliateApiKeys.findFirst();
                if (apiKeys) {
                    affiliateSecretKey = apiKeys.secretKey;
                    affiliateAccessKey = apiKeys.accessKey;
                } else {
                    console.log('No affiliate API keys found, cannot verify token');
                    return res.status(200).json({ success: false, message: 'Cannot verify payment without API keys' });
                }

                try {
                    // Verifitseeri token
                    decodedToken = jwt.verify(orderToken, affiliateSecretKey);

                    // Töötleme tavalise makse, mille andmeid ei olegi paymentMetadata tabelis
                    const { paymentStatus, merchantReference } = decodedToken;
                    console.log(`Regular payment status: ${paymentStatus}, reference: ${merchantReference}`);

                    // Vastame edukalt - checkout.js hoolitseb tegeliku ostu eest
                    return res.status(200).json({
                        success: true,
                        message: `Successfully processed regular payment webhook`
                    });
                } catch (verifyError) {
                    console.error('Error verifying token:', verifyError);
                    return res.status(200).json({ success: false, message: 'Error verifying token' });
                }
            }

            // Kui leidsime metadata, töötleme lepingumakse
            const { transactionId, contractId, affiliateId, isPaymentHoliday } = paymentMetadata;


            // Leia API võtmed affiliateId järgi
            const apiKeys = await prisma.affiliateApiKeys.findFirst({
                where: { affiliateId: affiliateId }
            });

            if (!apiKeys) {
                console.error(`API keys not found for affiliate ${affiliateId}`);
                return res.status(200).json({ success: false, message: 'API keys not found' });
            }

            // Seadista globaalsed muutujad
            affiliateSecretKey = apiKeys.secretKey;
            affiliateAccessKey = apiKeys.accessKey;

            // Verifitseeri token kasutades leitud võtit
            try {
                decodedToken = jwt.verify(orderToken, affiliateSecretKey);
            } catch (verifyError) {
                console.error('Error verifying token with affiliate key:', verifyError);
                return res.status(200).json({ success: false, message: 'Error verifying token with affiliate key' });
            }

            // Extract order information
            const {
                paymentStatus,
                merchantReference,
                grandTotal,
                currency
            } = decodedToken;



            // Uuenda vastavalt makse staatusele
            if (paymentStatus === 'PAID') {
                // 1. Uuenda tehingu olek
                try {
                    await prisma.transactions.update({
                        where: { id: transactionId },
                        data: { status: 'success' }
                    });

                } catch (updateError) {
                    console.error(`Error updating transaction: ${updateError.message}`);
                }

                // 2. Kui EI OLE payment holiday, siis uuenda userPlan
                if (!isPaymentHoliday) {
                    // Leia lepinguga seotud kasutaja plaan
                    const userPlan = await prisma.userPlan.findFirst({
                        where: { contractId: contractId }
                    });

                    if (userPlan) {


                        // Arvuta uus lõppkuupäev (lisa üks kuu)
                        let newEndDate = new Date(userPlan.endDate);
                        newEndDate.setMonth(newEndDate.getMonth() + 1);



                        // Uuenda kasutaja plaani kehtivust
                        await prisma.userPlan.update({
                            where: { id: userPlan.id },
                            data: { endDate: newEndDate }
                        });


                    } else {
                        console.error(`UserPlan not found for contract ${contractId}`);
                    }
                } else {
                    console.log(`Payment holiday for contract ${contractId} - not updating UserPlan`);
                }
            } else if (paymentStatus === 'VOIDED' || paymentStatus === 'ABANDONED') {
                console.log(`Marking transaction ${transactionId} as cancelled`);

                // Märgi tehing tühistatuks
                try {
                    await prisma.transactions.update({
                        where: { id: transactionId },
                        data: { status: 'cancelled' }
                    });
                    console.log(`Updated transaction ${transactionId} status to cancelled`);
                } catch (updateError) {
                    console.error(`Error updating transaction: ${updateError.message}`);
                }
            }

        } catch (error) {
            console.error('Error processing webhook token:', error);
            // Always return 200 to prevent Montonio from retrying
            return res.status(200).json({ success: false, message: 'Error processing token' });
        }

        // Always respond with 200 OK to acknowledge receipt of the webhook
        return res.status(200).json({
            success: true,
            message: `Successfully processed webhook`
        });
    } catch (error) {
        console.error('Error processing Montonio webhook:', error);
        // Still return a 200 status to prevent Montonio from retrying
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

        // First update the database - using updateMany instead of update
        await prisma.transactions.updateMany({
            where: {
                invoiceNumber: decoded.merchantReference
            },
            data: {
                status: 'success'
            }
        });

        // Only send response after database operation completes
        res.json({
            success: true,
            paymentStatus: decoded.paymentStatus,
            merchantReference: decoded.merchantReference,
            // Add any other fields you need
        });
    } catch (error) {
        // This catches errors from both JWT verification and database operations
        res.status(400).json({
            success: false,
            message: 'Invalid token or database error',
            error: error.message
        });
    }
};



module.exports = {
    createMontonioPayment,
    handleMontonioWebhook,
    handlePaymentReturn,
    checkPaymentStatus
};